import type { Project } from '@/types/project'
import { formatYearFromDate } from './date.ts'
import { MOTION_EASE_SOFT } from './motion.ts'

export const PLAYGROUND_ORBIT_ORDER = [
  'path',
  'sky-farm',
  'constellation',
  'little-lands',
  'obsidian-vault',
  'grand-teton-wallet',
  'mountain',
  'sunset-graphic',
  'iceland-graphics',
  'iceland-logo',
] as const

export const PLAYGROUND_MASTHEAD_KICKER = 'Lab ops'
export const PLAYGROUND_MASTHEAD_TITLE = 'Playground'
export const PLAYGROUND_MASTHEAD_SUMMARY_LABEL = 'Playground summary'
export const PLAYGROUND_MASTHEAD_MODE = 'Orbit'
export const PLAYGROUND_MASTHEAD_METRIC_LABELS = {
  routes: 'Routes',
  window: 'Window',
  mode: 'Mode',
} as const

export const PLAYGROUND_EMPTY_COPY = 'No archived projects yet.'
export const PLAYGROUND_FLIGHT_DECK_LABEL = 'Playground experiments'
export const PLAYGROUND_FLIGHT_DECK_TITLE = 'Experiment radar'
export const PLAYGROUND_FLIGHT_DECK_MODE = 'Auto orbit'
export const PLAYGROUND_GALLERY_LABEL = 'Playground gallery'
export const PLAYGROUND_GALLERY_TITLE = 'Playground'
export const PLAYGROUND_GALLERY_TILE_VARIANTS = [
  'portrait',
  'feature',
  'browser',
  'document',
  'phone',
  'stack',
  'address',
  'print',
] as const
export const PLAYGROUND_ORBIT_RADIUS_DESKTOP = 230
export const PLAYGROUND_ORBIT_RADIUS_LARGE = 262
export const PLAYGROUND_DEFAULT_ORBIT_RADIUS_DESKTOP = 300
export const PLAYGROUND_DEFAULT_ORBIT_RADIUS_LARGE = 360
export const PLAYGROUND_ORBIT_LARGE_VIEWPORT_WIDTH = 1280
export const PLAYGROUND_ORBIT_COMPACT_HEIGHT = 780
export const PLAYGROUND_ORBIT_TIGHT_RADIUS = 198
export const PLAYGROUND_ORBIT_MEDIUM_HEIGHT = 860
export const PLAYGROUND_ORBIT_MEDIUM_RADIUS = 214
export const PLAYGROUND_ORBIT_NORMAL_SPEED = 0.018
export const PLAYGROUND_ORBIT_SLOW_SPEED = 0.0035
export const PLAYGROUND_PRIORITY_IMAGE_COUNT = 4
export const PLAYGROUND_ORBIT_MIN_SCALE = 0.88
export const PLAYGROUND_ORBIT_SCALE_RANGE = 0.12
export const PLAYGROUND_ORBIT_MIN_OPACITY = 0.58
export const PLAYGROUND_ORBIT_OPACITY_RANGE = 0.42
export const PLAYGROUND_ORBIT_MIN_BRIGHTNESS = 0.82
export const PLAYGROUND_ORBIT_BRIGHTNESS_RANGE = 0.18
export const PLAYGROUND_ORBIT_BASE_Z_INDEX = 1
export const PLAYGROUND_ORBIT_Z_INDEX_RANGE = 20
export const PLAYGROUND_ORBIT_CARD_FULL_FILTER = 'brightness(1) saturate(1) contrast(1) blur(0px)'
export const PLAYGROUND_ORBIT_CARD_ACTIVE_FILTER = 'brightness(1.12) saturate(1.08) contrast(1.03) blur(0px)'
export const PLAYGROUND_ORBIT_CARD_MUTED_FILTER = 'brightness(0.72) saturate(0.56) blur(5px)'
export const PLAYGROUND_ORBIT_CARD_HOVER_SCALE = 1.18
export const PLAYGROUND_ORBIT_CARD_HOVER_Z_INDEX = 40
export const PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DELAY = 0.1
export const PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DURATION = 0.48
export const PLAYGROUND_ORBIT_CENTER_ENTRANCE_DURATION = 0.48
export const PLAYGROUND_ORBIT_QUICK_SWAP_DURATION = 0.2
export const PLAYGROUND_ORBIT_ENTRANCE = {
  centerDelay: 0.24,
  cardsDelay: 0.38,
  cardStagger: 0.1,
  cardDuration: 0.58,
  ease: MOTION_EASE_SOFT,
} as const

export interface PlaygroundMastheadMetric {
  label: string
  value: string
}

export type PlaygroundGalleryTileVariant = (typeof PLAYGROUND_GALLERY_TILE_VARIANTS)[number]

export interface PlaygroundProjectDisplayMeta {
  category: string
  position: string
  primaryTag: string
  routeCode: string
  title: string
  year: string
}

export interface PlaygroundProjectCardDisplayState {
  index: number
  meta: PlaygroundProjectDisplayMeta
  priorityImage: boolean
  project: Project
}

export interface PlaygroundGalleryTileState extends PlaygroundProjectCardDisplayState {
  variant: PlaygroundGalleryTileVariant
}

export interface PlaygroundCenterHubState {
  contentKey: string
  meta: PlaygroundProjectDisplayMeta
}

export interface PlaygroundMobileManifestState {
  leadMeta: PlaygroundProjectDisplayMeta | null
  routeCountLabel: string
}

export type PlaygroundMobileTileState = PlaygroundProjectCardDisplayState

export interface PlaygroundMobileViewState {
  manifest: PlaygroundMobileManifestState
  tileStates: PlaygroundMobileTileState[]
}

export interface PlaygroundOrbitCoordinates {
  x: number
  y: number
}

export interface PlaygroundOrbitResponsiveRadiusInput {
  radiusDesktop: number
  radiusLarge: number
  viewportHeight: number
  viewportWidth: number
}

export interface PlaygroundOrbitViewportSource {
  innerHeight: number
  innerWidth: number
  visualViewport?: {
    height: number
  } | null
}

export interface PlaygroundOrbitViewportSnapshot {
  viewportHeight: number
  viewportWidth: number
}

export interface PlaygroundOrbitSelectionInput {
  hoveredIndex: number | null
  projectCount: number
}

export interface PlaygroundOrbitSelection {
  activeIndex: number | null
  hasHoverTarget: boolean
}

export interface PlaygroundOrbitRenderState<ProjectItem> {
  activeIndex: number | null
  activeProject: ProjectItem | null
  canRender: boolean
  count: number
  selection: PlaygroundOrbitSelection
}

export interface PlaygroundOrbitCardLayoutInput {
  index: number
  projectCount: number
  selection: PlaygroundOrbitSelection
}

export interface PlaygroundOrbitCardLayout {
  baseAngle: number
  isHovered: boolean
  tilt: number
}

export interface PlaygroundOrbitCardState extends PlaygroundOrbitCardLayout, PlaygroundProjectCardDisplayState {}

export interface PlaygroundOrbitViewState {
  activeHub: PlaygroundCenterHubState | null
  canRender: boolean
  cardSize: number
  cardStates: PlaygroundOrbitCardState[]
  count: number
  selection: PlaygroundOrbitSelection
}

export function formatPlaygroundProjectCount(projectCount: number): string {
  return projectCount.toString().padStart(2, '0')
}

export function getPlaygroundMastheadMetrics(projectCount: number, archiveRange: string): PlaygroundMastheadMetric[] {
  return [
    { label: PLAYGROUND_MASTHEAD_METRIC_LABELS.routes, value: formatPlaygroundProjectCount(projectCount) },
    { label: PLAYGROUND_MASTHEAD_METRIC_LABELS.window, value: archiveRange },
    { label: PLAYGROUND_MASTHEAD_METRIC_LABELS.mode, value: PLAYGROUND_MASTHEAD_MODE },
  ]
}

export function getPlaygroundMotionInitial<Initial>(
  prefersReducedMotion: boolean,
  initial: Initial,
): false | Initial {
  return prefersReducedMotion ? false : initial
}

export function getProjectDisplayTitle(project: Project): string {
  return project.frontmatter.displayTitle ?? project.frontmatter.title
}

export function formatPlaygroundYear(date: string): string {
  return formatYearFromDate(date)
}

export function getProjectPrimaryTag(project: Project): string {
  return project.frontmatter.tags[0] ?? project.frontmatter.category
}

export function getPlaygroundRouteCode(project: Project, index: number): string {
  const initials = project.slug
    .split('-')
    .map((part) => part[0])
    .join('')
    .slice(0, 3)
    .toUpperCase()

  return `${initials || 'PG'}-${String(index + 1).padStart(2, '0')}`
}

export function formatPlaygroundPosition(index: number, count: number): string {
  return `${String(index + 1).padStart(2, '0')}/${String(count).padStart(2, '0')}`
}

export function getPlaygroundProjectDisplayMeta(
  project: Project,
  index: number,
  count: number,
): PlaygroundProjectDisplayMeta {
  return {
    category: project.frontmatter.category,
    position: formatPlaygroundPosition(index, count),
    primaryTag: getProjectPrimaryTag(project),
    routeCode: getPlaygroundRouteCode(project, index),
    title: getProjectDisplayTitle(project),
    year: formatPlaygroundYear(project.frontmatter.date),
  }
}

export function getPlaygroundProjectCardDisplayState(
  project: Project,
  index: number,
  count: number,
): PlaygroundProjectCardDisplayState {
  return {
    index,
    meta: getPlaygroundProjectDisplayMeta(project, index, count),
    priorityImage: shouldPrioritizePlaygroundImage(index),
    project,
  }
}

export function getPlaygroundGalleryTileVariant(index: number): PlaygroundGalleryTileVariant {
  return PLAYGROUND_GALLERY_TILE_VARIANTS[index % PLAYGROUND_GALLERY_TILE_VARIANTS.length]
}

export function getPlaygroundGalleryTileStates(projects: readonly Project[]): PlaygroundGalleryTileState[] {
  return projects.slice(0, PLAYGROUND_GALLERY_TILE_VARIANTS.length).map((project, index) => ({
    ...getPlaygroundProjectCardDisplayState(project, index, projects.length),
    variant: getPlaygroundGalleryTileVariant(index),
  }))
}

export function getPlaygroundCenterHubState(project: Project, index: number, count: number): PlaygroundCenterHubState {
  return {
    contentKey: project.slug,
    meta: getPlaygroundProjectDisplayMeta(project, index, count),
  }
}

export function getPlaygroundCenterHubStateFromCardState(
  cardState: PlaygroundProjectCardDisplayState,
): PlaygroundCenterHubState {
  return {
    contentKey: cardState.project.slug,
    meta: cardState.meta,
  }
}

export function getPlaygroundMobileManifestState(projects: readonly Project[]): PlaygroundMobileManifestState {
  const leadProject = projects[0]

  return {
    leadMeta: leadProject ? getPlaygroundProjectDisplayMeta(leadProject, 0, projects.length) : null,
    routeCountLabel: formatPlaygroundProjectCount(projects.length),
  }
}

export function getPlaygroundMobileTileStates(projects: readonly Project[]): PlaygroundMobileTileState[] {
  const count = projects.length

  return projects.map((project, index) => getPlaygroundProjectCardDisplayState(project, index, count))
}

export function getPlaygroundMobileViewState(projects: readonly Project[]): PlaygroundMobileViewState {
  return {
    manifest: getPlaygroundMobileManifestState(projects),
    tileStates: getPlaygroundMobileTileStates(projects),
  }
}

export function formatPlaygroundRange(projects: Project[]): string {
  const years = projects
    .map((project) => Number.parseInt(formatYearFromDate(project.frontmatter.date, ''), 10))
    .filter((year) => Number.isFinite(year))

  if (years.length === 0) return 'Now'

  const firstYear = Math.min(...years)
  const lastYear = Math.max(...years)

  return firstYear === lastYear ? `${lastYear}` : `${firstYear}-${lastYear}`
}

export function sortProjectsForPlayground(
  projects: Project[],
  preferredOrder: readonly string[] = PLAYGROUND_ORBIT_ORDER,
): Project[] {
  const rank = new Map<string, number>(preferredOrder.map((slug, index) => [slug, index]))

  return [...projects].sort((a, b) => {
    const aRank = rank.get(a.slug) ?? Number.MAX_SAFE_INTEGER
    const bRank = rank.get(b.slug) ?? Number.MAX_SAFE_INTEGER

    if (aRank !== bRank) {
      return aRank - bRank
    }

    return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
  })
}

export function getPlaygroundCardTilt(index: number): number {
  return ((index % 3) - 1) * 3
}

export interface PlaygroundEntranceTiming {
  cardsDelay: number
  cardDuration: number
  cardStagger: number
}

export interface PlaygroundEntranceMotionTiming extends PlaygroundEntranceTiming {
  ease: typeof PLAYGROUND_ORBIT_ENTRANCE.ease
}

export interface PlaygroundOrbitCardEntranceTransition {
  delay: number
  duration: number
  ease: typeof PLAYGROUND_ORBIT_ENTRANCE.ease
}

export interface PlaygroundOrbitCardEntranceFrame {
  [key: string]: string | number
  filter: string
  opacity: number
  scale: number
}

export interface PlaygroundOrbitCardEntranceMotion {
  animate: PlaygroundOrbitCardEntranceFrame
  initial: PlaygroundOrbitCardEntranceFrame
}

export interface PlaygroundVerticalEntranceInput {
  blur: number
  y: number
}

export interface PlaygroundVerticalEntranceFrame {
  [key: string]: string | number
  filter: string
  opacity: number
  y: number
}

export interface PlaygroundVerticalEntranceMotion {
  animate: PlaygroundVerticalEntranceFrame
  initial: PlaygroundVerticalEntranceFrame
}

export interface PlaygroundMobileManifestEntranceTransition {
  delay: number
  duration: number
  ease: typeof PLAYGROUND_ORBIT_ENTRANCE.ease
}

export interface PlaygroundOrbitCenterEntranceFrame {
  [key: string]: string | number
  filter: string
  opacity: number
  scale: number
}

export interface PlaygroundOrbitCenterEntranceMotion {
  animate: PlaygroundOrbitCenterEntranceFrame
  initial: PlaygroundOrbitCenterEntranceFrame
}

export interface PlaygroundOrbitCenterEntranceTransition {
  delay: number
  duration: number
  ease: typeof PLAYGROUND_ORBIT_ENTRANCE.ease
}

export interface PlaygroundOrbitQuickSwapTransition {
  duration: number
  ease: typeof PLAYGROUND_ORBIT_ENTRANCE.ease
}

export interface PlaygroundOrbitVerticalSwapInput {
  exitY: number
  initialY: number
}

export interface PlaygroundOrbitVerticalSwapFrame {
  [key: string]: string | number
  filter: string
  opacity: number
  y: number
}

export interface PlaygroundOrbitVerticalSwapMotion {
  animate: PlaygroundOrbitVerticalSwapFrame
  exit: PlaygroundOrbitVerticalSwapFrame
  initial: PlaygroundOrbitVerticalSwapFrame
}

export interface PlaygroundHoverContainmentTarget {
  contains(target: Node | null): boolean
}

export interface PlaygroundOrbitSpeedInput {
  hoveredIndex: number | null
  normalSpeed: number
  orbitActive: boolean
  slowSpeed: number
}

export interface PlaygroundOrbitAnimationFrameInput {
  currentRotation: number
  currentSpeed: number
  normalSpeed: number
  orbitActive: boolean
  selection: PlaygroundOrbitSelection
  slowSpeed: number
  smoothing?: number
}

export interface PlaygroundOrbitStepInput {
  currentRotation: number
  currentSpeed: number
  smoothing?: number
  targetSpeed: number
}

export interface PlaygroundOrbitInteractionInput<RestFilter> {
  hasHoverTarget: boolean
  isHovered: boolean
  restFilter: RestFilter
}

export interface PlaygroundOrbitCardRestFrame {
  [key: string]: string | number
  filter: string
  opacity: number
  scale: number
  zIndex: number
}

export interface PlaygroundOrbitCardFrameInput {
  baseAngle: number
  orbitRadius: number
  rotation: number
}

export interface PlaygroundOrbitCardFrame extends PlaygroundOrbitCardRestFrame, PlaygroundOrbitCoordinates {
  depth: number
}

export function getPlaygroundOrbitBaseAngle(index: number, count: number): number {
  if (count <= 0) return 0

  return (index / count) * 360
}

export function getPlaygroundOrbitRadians(baseAngle: number, rotation: number): number {
  return ((baseAngle + rotation) * Math.PI) / 180
}

export function getPlaygroundOrbitCoordinates(
  baseAngle: number,
  rotation: number,
  orbitRadius: number,
): PlaygroundOrbitCoordinates {
  const radians = getPlaygroundOrbitRadians(baseAngle, rotation)

  return {
    x: Math.sin(radians) * orbitRadius,
    y: -Math.cos(radians) * orbitRadius,
  }
}

export function getPlaygroundOrbitDepth(baseAngle: number, rotation: number): number {
  return (1 - Math.cos(getPlaygroundOrbitRadians(baseAngle, rotation))) / 2
}

export function getPlaygroundOrbitScale(depth: number): number {
  return PLAYGROUND_ORBIT_MIN_SCALE + depth * PLAYGROUND_ORBIT_SCALE_RANGE
}

export function getPlaygroundOrbitOpacity(depth: number): number {
  return PLAYGROUND_ORBIT_MIN_OPACITY + depth * PLAYGROUND_ORBIT_OPACITY_RANGE
}

export function getPlaygroundOrbitRestFilter(depth: number): string {
  return `brightness(${PLAYGROUND_ORBIT_MIN_BRIGHTNESS + depth * PLAYGROUND_ORBIT_BRIGHTNESS_RANGE}) blur(0px)`
}

export function getPlaygroundOrbitZIndex(depth: number): number {
  return PLAYGROUND_ORBIT_BASE_Z_INDEX + Math.round(depth * PLAYGROUND_ORBIT_Z_INDEX_RANGE)
}

export function getPlaygroundOrbitCardRestFrame(depth: number): PlaygroundOrbitCardRestFrame {
  return {
    filter: getPlaygroundOrbitRestFilter(depth),
    opacity: getPlaygroundOrbitOpacity(depth),
    scale: getPlaygroundOrbitScale(depth),
    zIndex: getPlaygroundOrbitZIndex(depth),
  }
}

export function getPlaygroundOrbitCardFrame({
  baseAngle,
  orbitRadius,
  rotation,
}: PlaygroundOrbitCardFrameInput): PlaygroundOrbitCardFrame {
  const coordinates = getPlaygroundOrbitCoordinates(baseAngle, rotation, orbitRadius)
  const depth = getPlaygroundOrbitDepth(baseAngle, rotation)

  return {
    ...coordinates,
    depth,
    ...getPlaygroundOrbitCardRestFrame(depth),
  }
}

export function getPlaygroundOrbitCardSize(count: number): number {
  if (count >= 9) return 112
  if (count >= 7) return 120
  if (count >= 5) return 132
  return 144
}

export function getPlaygroundOrbitSelection({
  hoveredIndex,
  projectCount,
}: PlaygroundOrbitSelectionInput): PlaygroundOrbitSelection {
  if (projectCount <= 0) {
    return { activeIndex: null, hasHoverTarget: false }
  }

  const hasHoverTarget =
    hoveredIndex !== null &&
    hoveredIndex >= 0 &&
    hoveredIndex < projectCount

  return {
    activeIndex: hasHoverTarget ? hoveredIndex : 0,
    hasHoverTarget,
  }
}

export function getPlaygroundOrbitRenderState<ProjectItem>(
  projects: readonly ProjectItem[],
  hoveredIndex: number | null,
): PlaygroundOrbitRenderState<ProjectItem> {
  const count = projects.length
  const selection = getPlaygroundOrbitSelection({ hoveredIndex, projectCount: count })
  const activeProject = selection.activeIndex === null ? null : projects[selection.activeIndex] ?? null

  return {
    activeIndex: selection.activeIndex,
    activeProject,
    canRender: count > 0 && activeProject !== null && selection.activeIndex !== null,
    count,
    selection,
  }
}

export function getPlaygroundOrbitCardLayout({
  index,
  projectCount,
  selection,
}: PlaygroundOrbitCardLayoutInput): PlaygroundOrbitCardLayout {
  return {
    baseAngle: getPlaygroundOrbitBaseAngle(index, projectCount),
    isHovered: selection.hasHoverTarget && selection.activeIndex === index,
    tilt: getPlaygroundCardTilt(index),
  }
}

export function getPlaygroundOrbitCardStates(
  projects: readonly Project[],
  selection: PlaygroundOrbitSelection,
): PlaygroundOrbitCardState[] {
  const count = projects.length

  return projects.map((project, index) => ({
    ...getPlaygroundProjectCardDisplayState(project, index, count),
    ...getPlaygroundOrbitCardLayout({
      index,
      projectCount: count,
      selection,
    }),
  }))
}

export function getPlaygroundOrbitViewState(
  projects: readonly Project[],
  hoveredIndex: number | null,
): PlaygroundOrbitViewState {
  const orbitState = getPlaygroundOrbitRenderState(projects, hoveredIndex)
  const cardStates = getPlaygroundOrbitCardStates(projects, orbitState.selection)
  const activeCard = orbitState.activeIndex === null ? null : cardStates[orbitState.activeIndex] ?? null

  return {
    activeHub: activeCard ? getPlaygroundCenterHubStateFromCardState(activeCard) : null,
    canRender: orbitState.canRender && activeCard !== null,
    cardSize: getPlaygroundOrbitCardSize(orbitState.count),
    cardStates,
    count: orbitState.count,
    selection: orbitState.selection,
  }
}

export function getPlaygroundOrbitResponsiveRadius({
  radiusDesktop,
  radiusLarge,
  viewportHeight,
  viewportWidth,
}: PlaygroundOrbitResponsiveRadiusInput): number {
  const widthRadius = viewportWidth >= PLAYGROUND_ORBIT_LARGE_VIEWPORT_WIDTH ? radiusLarge : radiusDesktop
  const heightRadius =
    viewportHeight < PLAYGROUND_ORBIT_COMPACT_HEIGHT
      ? PLAYGROUND_ORBIT_TIGHT_RADIUS
      : viewportHeight < PLAYGROUND_ORBIT_MEDIUM_HEIGHT
        ? PLAYGROUND_ORBIT_MEDIUM_RADIUS
        : widthRadius

  return Math.min(widthRadius, heightRadius)
}

export function getPlaygroundOrbitViewportSnapshot(
  viewportSource: PlaygroundOrbitViewportSource,
): PlaygroundOrbitViewportSnapshot {
  return {
    viewportHeight: viewportSource.visualViewport?.height ?? viewportSource.innerHeight,
    viewportWidth: viewportSource.innerWidth,
  }
}

export function shouldPrioritizePlaygroundImage(index: number): boolean {
  return index < PLAYGROUND_PRIORITY_IMAGE_COUNT
}

export function getPlaygroundEntranceDurationMs(projectCount: number, timing: PlaygroundEntranceTiming): number {
  return (timing.cardsDelay + projectCount * timing.cardStagger + timing.cardDuration) * 1000
}

export function schedulePlaygroundOrbitActivation<TTimer>({
  projectCount,
  scheduleActivation,
  timing = PLAYGROUND_ORBIT_ENTRANCE,
}: {
  projectCount: number
  scheduleActivation: (delayMs: number) => TTimer
  timing?: PlaygroundEntranceTiming
}): TTimer {
  return scheduleActivation(getPlaygroundEntranceDurationMs(projectCount, timing))
}

export function getPlaygroundOrbitCardEntranceDelay(
  index: number,
  timing: PlaygroundEntranceTiming = PLAYGROUND_ORBIT_ENTRANCE,
): number {
  return timing.cardsDelay + index * timing.cardStagger
}

export function getPlaygroundOrbitCardEntranceTransition(
  index: number,
  timing: PlaygroundEntranceMotionTiming = PLAYGROUND_ORBIT_ENTRANCE,
): PlaygroundOrbitCardEntranceTransition {
  return {
    delay: getPlaygroundOrbitCardEntranceDelay(index, timing),
    duration: timing.cardDuration,
    ease: timing.ease,
  }
}

export function getPlaygroundOrbitCardEntranceMotion(): PlaygroundOrbitCardEntranceMotion {
  return {
    initial: { opacity: 0, scale: 0.8, filter: 'blur(6px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  }
}

export function getPlaygroundVerticalEntranceMotion({
  blur,
  y,
}: PlaygroundVerticalEntranceInput): PlaygroundVerticalEntranceMotion {
  return {
    initial: { opacity: 0, y, filter: `blur(${blur}px)` },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  }
}

export function getPlaygroundMobileManifestEntranceTransition(
  timing: Pick<typeof PLAYGROUND_ORBIT_ENTRANCE, 'ease'> = PLAYGROUND_ORBIT_ENTRANCE,
): PlaygroundMobileManifestEntranceTransition {
  return {
    delay: PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DELAY,
    duration: PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DURATION,
    ease: timing.ease,
  }
}

export function getPlaygroundOrbitCenterEntranceMotion(): PlaygroundOrbitCenterEntranceMotion {
  return {
    initial: { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  }
}

export function getPlaygroundOrbitCenterEntranceTransition(
  timing: Pick<typeof PLAYGROUND_ORBIT_ENTRANCE, 'centerDelay' | 'ease'> = PLAYGROUND_ORBIT_ENTRANCE,
): PlaygroundOrbitCenterEntranceTransition {
  return {
    delay: timing.centerDelay,
    duration: PLAYGROUND_ORBIT_CENTER_ENTRANCE_DURATION,
    ease: timing.ease,
  }
}

export function getPlaygroundOrbitQuickSwapTransition(): PlaygroundOrbitQuickSwapTransition {
  return {
    duration: PLAYGROUND_ORBIT_QUICK_SWAP_DURATION,
    ease: PLAYGROUND_ORBIT_ENTRANCE.ease,
  }
}

export function getPlaygroundOrbitVerticalSwapMotion({
  exitY,
  initialY,
}: PlaygroundOrbitVerticalSwapInput): PlaygroundOrbitVerticalSwapMotion {
  return {
    initial: { opacity: 0, y: initialY, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: exitY, filter: 'blur(4px)' },
  }
}

export function shouldClearPlaygroundHoverOnBlur(
  currentTarget: PlaygroundHoverContainmentTarget,
  nextTarget: Node | null,
): boolean {
  return !currentTarget.contains(nextTarget)
}

export function getPlaygroundOrbitCardInnerClassName(prefersReducedMotion: boolean): string {
  const transitionClass = prefersReducedMotion
    ? 'transition-none'
    : 'transition-[filter,transform] duration-700 ease-soft'

  return `will-change-transform ${transitionClass}`
}

export function getPlaygroundOrbitCardHoverScale(isHovered: boolean): number {
  return isHovered ? PLAYGROUND_ORBIT_CARD_HOVER_SCALE : 1
}

export function getPlaygroundOrbitCardZIndex<RestZIndex>(isHovered: boolean, restZIndex: RestZIndex): RestZIndex | number {
  return isHovered ? PLAYGROUND_ORBIT_CARD_HOVER_Z_INDEX : restZIndex
}

export function getPlaygroundOrbitInteractionFilter<RestFilter>({
  hasHoverTarget,
  isHovered,
}: PlaygroundOrbitInteractionInput<RestFilter>): RestFilter | string {
  if (hasHoverTarget && !isHovered) return PLAYGROUND_ORBIT_CARD_MUTED_FILTER
  if (isHovered) return PLAYGROUND_ORBIT_CARD_ACTIVE_FILTER

  return PLAYGROUND_ORBIT_CARD_FULL_FILTER
}

export function getPlaygroundOrbitSpeedTarget({
  hoveredIndex,
  normalSpeed,
  orbitActive,
  slowSpeed,
}: PlaygroundOrbitSpeedInput): number {
  if (!orbitActive) return 0

  return hoveredIndex === null ? normalSpeed : slowSpeed
}

export function getPlaygroundOrbitSpeedHoverIndex(selection: PlaygroundOrbitSelection): number | null {
  return selection.hasHoverTarget ? selection.activeIndex : null
}

export function getNextPlaygroundOrbitStep({
  currentRotation,
  currentSpeed,
  smoothing = 0.04,
  targetSpeed,
}: PlaygroundOrbitStepInput): { rotation: number; speed: number } {
  const speed = currentSpeed + (targetSpeed - currentSpeed) * smoothing
  const rotation = Math.abs(speed) > 0.0001 ? (currentRotation + speed) % 360 : currentRotation

  return { rotation, speed }
}

export function getNextPlaygroundOrbitAnimationFrame({
  currentRotation,
  currentSpeed,
  normalSpeed,
  orbitActive,
  selection,
  slowSpeed,
  smoothing,
}: PlaygroundOrbitAnimationFrameInput): { rotation: number; speed: number } {
  const targetSpeed = getPlaygroundOrbitSpeedTarget({
    hoveredIndex: getPlaygroundOrbitSpeedHoverIndex(selection),
    normalSpeed,
    orbitActive,
    slowSpeed,
  })

  return getNextPlaygroundOrbitStep({
    currentRotation,
    currentSpeed,
    smoothing,
    targetSpeed,
  })
}
