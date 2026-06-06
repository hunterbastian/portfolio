import type { CaseStudyProject } from './case-study-projects.ts'
export { CASE_STUDY_ORDER, sortCaseStudyProjects } from './case-study-projects.ts'

export type ProjectGridProject = CaseStudyProject

export type StackPriority = 'default' | 'center' | 'left' | 'right'

export interface ProjectGridDialConfig {
  expanded: {
    gapX: number
    gapY: number
    scale: number
  }
  hover: {
    inactiveOpacity: number
  }
  motion: {
    collapseMs: number
    expandMs: number
  }
  pile: {
    compactGapX: number
    compactGapY: number
    compactScale: number
    stackPriority: StackPriority
  }
}

export interface ProjectGridLayoutMetrics {
  gridColumnGap: number
  gridRowGap: number
  layoutTransitionDuration: number
  targetScale: number
}

export interface ProjectGridFlatTransform {
  rotate: number
  x: number
}

export interface ProjectGridRevealTiming {
  cardsAppear: number
  panelAppear: number
}

export interface ProjectGridRevealStep {
  completesEntrance: boolean
  delay: number
  stage: number
}

export interface ProjectGridStaticCardStyleInput {
  cardOpacity: number
  targetScale: number
  zIndex: number
}

export interface ProjectGridCardState<ProjectType extends ProjectGridProject = ProjectGridProject> {
  cardOpacity: number
  index: number
  isHovered: boolean
  project: ProjectType
  stackZIndex: number
}

export interface ProjectGridViewState<ProjectType extends ProjectGridProject = ProjectGridProject> {
  cardStates: ProjectGridCardState<ProjectType>[]
  layoutMetrics: ProjectGridLayoutMetrics
  totalProjects: number
}

export interface ProjectGridCardOpacityInput {
  hoveredIndex: number | null
  inactiveOpacity: number
  index: number
  supportsHover: boolean
}

export interface ProjectGridViewStateInput {
  dial: ProjectGridDialConfig
  hoveredIndex: number | null
  isExpandedLayout: boolean
  supportsHover: boolean
}

export interface ProjectGridRevealScheduleInput<TTimer> {
  hasPlayedEntrance: boolean
  initialLoadDelayMs: number
  isGridInView: boolean
  prefersReducedMotion: boolean
  scheduleStage: (step: ProjectGridRevealStep) => TTimer
  setHasPlayedEntrance: (hasPlayedEntrance: boolean) => void
  setStage: (stage: number) => void
  timing: ProjectGridRevealTiming
}

export const PROJECT_GRID_CARD_SLOT_CLASS_NAME = 'w-full transition-[transform,opacity] duration-[550ms] ease-soft'
export const PROJECT_GRID_INITIAL_STAGE = 0
export const PROJECT_GRID_PANEL_STAGE = 1
export const PROJECT_GRID_CARDS_STAGE = 2
export const PROJECT_GRID_REDUCED_MOTION_STAGE = PROJECT_GRID_CARDS_STAGE

export const PROJECT_GRID_FLAT_TRANSFORM: ProjectGridFlatTransform = {
  x: 0,
  rotate: 0,
}

export function getProjectGridRevealSteps(
  initialDelayMs: number,
  timing: ProjectGridRevealTiming,
): ProjectGridRevealStep[] {
  return [
    {
      completesEntrance: false,
      delay: initialDelayMs + timing.panelAppear,
      stage: PROJECT_GRID_PANEL_STAGE,
    },
    {
      completesEntrance: true,
      delay: initialDelayMs + timing.cardsAppear,
      stage: PROJECT_GRID_CARDS_STAGE,
    },
  ]
}

export function scheduleProjectGridRevealStages<TTimer>({
  hasPlayedEntrance,
  initialLoadDelayMs,
  isGridInView,
  prefersReducedMotion,
  scheduleStage,
  setHasPlayedEntrance,
  setStage,
  timing,
}: ProjectGridRevealScheduleInput<TTimer>): TTimer[] {
  if (!isGridInView) {
    setStage(PROJECT_GRID_INITIAL_STAGE)
    return []
  }

  if (prefersReducedMotion) {
    setStage(PROJECT_GRID_REDUCED_MOTION_STAGE)
    setHasPlayedEntrance(true)
    return []
  }

  const initialDelay = hasPlayedEntrance ? 0 : initialLoadDelayMs
  setStage(PROJECT_GRID_INITIAL_STAGE)
  return getProjectGridRevealSteps(initialDelay, timing).map(scheduleStage)
}

export function getProjectStackZIndex(index: number, total: number, stackPriority: StackPriority): number {
  if (stackPriority === 'center') {
    const center = (total - 1) / 2
    return Math.round(total - Math.abs(index - center) * 2)
  }

  if (stackPriority === 'left') {
    return total - index
  }

  if (stackPriority === 'right') {
    return index + 1
  }

  return index + 1
}

export function getProjectGridStaticCardTransform(
  targetScale: number,
  transform: ProjectGridFlatTransform = PROJECT_GRID_FLAT_TRANSFORM,
): string {
  return `translateX(${transform.x}px) rotate(${transform.rotate}deg) scale(${targetScale})`
}

export function getProjectGridStaticCardStyle({
  cardOpacity,
  targetScale,
  zIndex,
}: ProjectGridStaticCardStyleInput): { opacity: number; transform: string; zIndex: number } {
  return {
    zIndex,
    opacity: cardOpacity,
    transform: getProjectGridStaticCardTransform(targetScale),
  }
}

export function getProjectGridLayoutMetrics(
  isExpandedLayout: boolean,
  dial: ProjectGridDialConfig,
): ProjectGridLayoutMetrics {
  return {
    gridColumnGap: isExpandedLayout ? dial.expanded.gapX : dial.pile.compactGapX,
    gridRowGap: isExpandedLayout ? dial.expanded.gapY : dial.pile.compactGapY,
    layoutTransitionDuration: isExpandedLayout ? dial.motion.expandMs : dial.motion.collapseMs,
    targetScale: isExpandedLayout ? dial.expanded.scale : dial.pile.compactScale,
  }
}

export function getProjectGridCardOpacity({
  hoveredIndex,
  inactiveOpacity,
  index,
  supportsHover,
}: ProjectGridCardOpacityInput): number {
  if (!supportsHover || hoveredIndex === null || hoveredIndex === index) {
    return 1
  }

  return inactiveOpacity
}

export function getProjectGridCardZIndex(isHovered: boolean, totalProjects: number, stackZIndex: number): number {
  return isHovered ? totalProjects + 20 : stackZIndex
}

export function getProjectGridCardState<ProjectType extends ProjectGridProject>(
  project: ProjectType,
  index: number,
  totalProjects: number,
  { dial, hoveredIndex, supportsHover }: Omit<ProjectGridViewStateInput, 'isExpandedLayout'>,
): ProjectGridCardState<ProjectType> {
  return {
    cardOpacity: getProjectGridCardOpacity({
      hoveredIndex,
      inactiveOpacity: dial.hover.inactiveOpacity,
      index,
      supportsHover,
    }),
    index,
    isHovered: hoveredIndex === index,
    project,
    stackZIndex: getProjectStackZIndex(index, totalProjects, dial.pile.stackPriority),
  }
}

export function getProjectGridViewStateFromOrderedProjects<ProjectType extends ProjectGridProject>(
  orderedProjects: ProjectType[],
  input: ProjectGridViewStateInput,
): ProjectGridViewState<ProjectType> {
  const totalProjects = orderedProjects.length

  return {
    cardStates: orderedProjects.map((project, index) =>
      getProjectGridCardState(project, index, totalProjects, input),
    ),
    layoutMetrics: getProjectGridLayoutMetrics(input.isExpandedLayout, input.dial),
    totalProjects,
  }
}
