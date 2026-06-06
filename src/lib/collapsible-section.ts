export type SectionKind = 'work' | 'writing' | 'games' | 'contact' | 'archive' | 'now'

export interface SplitSectionTitle {
  label: string
  number: string | null
}

export const SECTION_TIMING = {
  panelAppear: 80,
  rowsAppear: 200,
  panelDuration: 380,
  rowDuration: 420,
  rowStagger: 70,
} as const

export const SECTION_PANEL_STATE = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,
  finalY: 0,
} as const

export const SECTION_ROW_STATE = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,
  finalY: 0,
} as const

export const LABEL_TIMING = {
  start: 72,
  duration: 420,
} as const

export const SECTION_STAGE = {
  hidden: 0,
  panel: 1,
  rows: 2,
} as const

export const SECTION_TITLE_STAGE = {
  hidden: 0,
  visible: 1,
} as const

export const SECTION_TITLE_INITIAL_Y = 6

export type SectionEntranceSchedule =
  | { kind: 'hidden' }
  | { kind: 'immediate'; stage: number }
  | { kind: 'staged'; panelDelay: number; rowsDelay: number }

export interface SectionEntranceScheduleInput {
  hasPlayed: boolean
  initialLoadDelayMs: number
  isInView: boolean
  isOpen: boolean
  prefersReducedMotion: boolean
}

export interface SectionEntranceStageSchedulerInput<TTimer> extends SectionEntranceScheduleInput {
  scheduleStage: (stage: number, delay: number, markPlayed: boolean) => TTimer
  setHasPlayed: (hasPlayed: boolean) => void
  setStage: (stage: number) => void
}

export interface SectionTitleEntranceSchedulerInput<TTimer> {
  hasPlayed: boolean
  initialLoadDelayMs: number
  isTitleInView: boolean
  prefersReducedMotion: boolean
  scheduleVisible: (delay: number) => TTimer
  setHasPlayed: (hasPlayed: boolean) => void
  setTitleStage: (stage: number) => void
}

export function splitSectionTitle(title: string): SplitSectionTitle {
  const match = title.match(/^(\d+)\s+(.+)$/)
  if (!match) return { number: null, label: title }
  return { number: match[1], label: match[2] }
}

export function getCollapsibleSectionClassName({
  className,
  closedClassName,
  isOpen,
  openClassName,
}: {
  className?: string
  closedClassName?: string
  isOpen: boolean
  openClassName?: string
}): string {
  return [className, isOpen ? openClassName : closedClassName, 'performance-section transition-[padding] duration-300']
    .filter(Boolean)
    .join(' ')
}

export function getStagedSectionMotion({
  finalOpacity,
  finalY,
  initialOpacity,
  initialY,
  ready,
  skipStaging,
}: {
  finalOpacity: number
  finalY: number
  initialOpacity: number
  initialY: number
  ready: boolean
  skipStaging: boolean
}) {
  return {
    opacity: skipStaging || ready ? finalOpacity : initialOpacity,
    y: skipStaging || ready ? finalY : initialY,
  }
}

export function isSectionStageReady(stage: number, readyStage: number) {
  return stage >= readyStage
}

export function getSectionTitleMotion(titleStage: number) {
  const visible = titleStage >= SECTION_TITLE_STAGE.visible

  return {
    opacity: visible ? 1 : 0,
    y: visible ? 0 : SECTION_TITLE_INITIAL_Y,
  }
}

export function getSectionTransitionDuration(skipStaging: boolean, duration: number) {
  return skipStaging ? 0 : duration
}

export function getSectionRowDelay({
  index,
  rowStagger,
  skipStaging,
  stage,
}: {
  index: number
  rowStagger: number
  skipStaging: boolean
  stage: number
}) {
  if (skipStaging || !isSectionStageReady(stage, SECTION_STAGE.rows)) return 0

  return index * rowStagger
}

export function getSectionRowKey(childKey: string | number | bigint | null | undefined, index: number) {
  return childKey != null ? String(childKey) : `section-row-${index}`
}

export function getSectionEntranceSchedule({
  hasPlayed,
  initialLoadDelayMs,
  isInView,
  isOpen,
  prefersReducedMotion,
}: SectionEntranceScheduleInput): SectionEntranceSchedule {
  if (!isOpen || !isInView) {
    return { kind: 'hidden' }
  }

  if (prefersReducedMotion) {
    return { kind: 'immediate', stage: SECTION_STAGE.rows }
  }

  const initialDelay = hasPlayed ? 0 : initialLoadDelayMs

  return {
    kind: 'staged',
    panelDelay: initialDelay + SECTION_TIMING.panelAppear,
    rowsDelay: initialDelay + SECTION_TIMING.rowsAppear,
  }
}

export function scheduleSectionEntranceStages<TTimer>({
  scheduleStage,
  setHasPlayed,
  setStage,
  ...input
}: SectionEntranceStageSchedulerInput<TTimer>): TTimer[] {
  const schedule = getSectionEntranceSchedule(input)

  if (schedule.kind === 'hidden') {
    setStage(SECTION_STAGE.hidden)
    return []
  }

  if (schedule.kind === 'immediate') {
    setStage(schedule.stage)
    setHasPlayed(true)
    return []
  }

  setStage(SECTION_STAGE.hidden)
  return [
    scheduleStage(SECTION_STAGE.panel, schedule.panelDelay, false),
    scheduleStage(SECTION_STAGE.rows, schedule.rowsDelay, true),
  ]
}

export function scheduleSectionTitleEntrance<TTimer>({
  hasPlayed,
  initialLoadDelayMs,
  isTitleInView,
  prefersReducedMotion,
  scheduleVisible,
  setHasPlayed,
  setTitleStage,
}: SectionTitleEntranceSchedulerInput<TTimer>): TTimer[] {
  if (!isTitleInView) {
    setTitleStage(SECTION_TITLE_STAGE.hidden)
    return []
  }

  if (prefersReducedMotion) {
    setTitleStage(SECTION_TITLE_STAGE.visible)
    setHasPlayed(true)
    return []
  }

  if (hasPlayed) {
    setTitleStage(SECTION_TITLE_STAGE.visible)
    return []
  }

  setTitleStage(SECTION_TITLE_STAGE.hidden)
  return [scheduleVisible(initialLoadDelayMs + LABEL_TIMING.start)]
}
