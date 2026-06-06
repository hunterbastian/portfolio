export const PAGE_TRANSITION_TIMING = {
  oldFadeDuration: 140,
  newContentDelay: 24,
  newSlideDuration: 220,
  childStartDelay: 20,
  childStagger: 0,
  childDuration: 200,
} as const

export const PAGE_ENTRANCE_INITIAL_Y = 6
export const CHILD_ENTRANCE_INITIAL_Y = 4

export const PAGE_TRANSITION_STAGE = {
  hidden: 0,
  page: 1,
  children: 2,
} as const

export type RouteSceneStage = (typeof PAGE_TRANSITION_STAGE)[keyof typeof PAGE_TRANSITION_STAGE]

export const PAGE_TRANSITION_PAGE_STATE = {
  initialY: PAGE_ENTRANCE_INITIAL_Y,
  finalY: 0,
  initialOpacity: 0,
  finalOpacity: 1,
  exitOpacity: 0,
  exitY: -4,
} as const

export const PAGE_TRANSITION_CHILD_STATE = {
  initialY: CHILD_ENTRANCE_INITIAL_Y,
  finalY: 0,
  initialOpacity: 0,
  finalOpacity: 1,
} as const

export interface RouteSceneTiming {
  newContentDelay: number
  newSlideDuration: number
  childStartDelay: number
  childStagger: number
  childDuration: number
}

export interface RouteSceneOffsets {
  pageY: number
  childY: number
}

export interface RouteSceneDefaults {
  offsets: RouteSceneOffsets
  timing: RouteSceneTiming
}

export type RouteSceneStageSchedule =
  | { kind: 'preserve' }
  | { kind: 'immediate'; stage: RouteSceneStage }
  | { kind: 'staged'; pageDelay: number; childrenDelay: number }

export interface RouteSceneStageScheduleInput {
  isInitialLoad: boolean
  prefersReducedMotion: boolean
  timing: Pick<RouteSceneTiming, 'childStartDelay' | 'newContentDelay'>
}

export interface RouteSceneStageSchedulerInput<TTimer> extends RouteSceneStageScheduleInput {
  scheduleStage: (stage: RouteSceneStage, delay: number) => TTimer
  setStage: (stage: RouteSceneStage) => void
}

export function getPageTransitionYOffset(): number {
  return PAGE_ENTRANCE_INITIAL_Y + CHILD_ENTRANCE_INITIAL_Y
}

export function getInitialRouteSceneStage(isInitialLoad: boolean): RouteSceneStage {
  return isInitialLoad ? PAGE_TRANSITION_STAGE.children : PAGE_TRANSITION_STAGE.hidden
}

export function getRouteSceneDefaults(): RouteSceneDefaults {
  return {
    offsets: {
      pageY: PAGE_TRANSITION_PAGE_STATE.initialY,
      childY: PAGE_TRANSITION_CHILD_STATE.initialY,
    },
    timing: {
      newContentDelay: PAGE_TRANSITION_TIMING.newContentDelay,
      newSlideDuration: PAGE_TRANSITION_TIMING.newSlideDuration,
      childStartDelay: PAGE_TRANSITION_TIMING.childStartDelay,
      childStagger: PAGE_TRANSITION_TIMING.childStagger,
      childDuration: PAGE_TRANSITION_TIMING.childDuration,
    },
  }
}

export function getRouteSceneStageSchedule({
  isInitialLoad,
  prefersReducedMotion,
  timing,
}: RouteSceneStageScheduleInput): RouteSceneStageSchedule {
  if (isInitialLoad) {
    return { kind: 'preserve' }
  }

  if (prefersReducedMotion) {
    return { kind: 'immediate', stage: PAGE_TRANSITION_STAGE.children }
  }

  return {
    kind: 'staged',
    pageDelay: timing.newContentDelay,
    childrenDelay: timing.newContentDelay + timing.childStartDelay,
  }
}

export function scheduleRouteSceneStages<TTimer>({
  isInitialLoad,
  prefersReducedMotion,
  scheduleStage,
  setStage,
  timing,
}: RouteSceneStageSchedulerInput<TTimer>): TTimer[] {
  const schedule = getRouteSceneStageSchedule({ isInitialLoad, prefersReducedMotion, timing })

  if (schedule.kind === 'preserve') {
    return []
  }

  if (schedule.kind === 'immediate') {
    setStage(schedule.stage)
    return []
  }

  setStage(PAGE_TRANSITION_STAGE.hidden)

  return [
    scheduleStage(PAGE_TRANSITION_STAGE.page, schedule.pageDelay),
    scheduleStage(PAGE_TRANSITION_STAGE.children, schedule.childrenDelay),
  ]
}

export function getRouteSceneInitial(isInitialLoad: boolean, initialY: number) {
  if (isInitialLoad) return false
  return {
    opacity: PAGE_TRANSITION_PAGE_STATE.initialOpacity,
    y: initialY,
  }
}

export function getRouteSceneMotion(stage: number, visibleStage: number, initialY: number) {
  const visible = stage >= visibleStage

  return {
    opacity: visible ? PAGE_TRANSITION_PAGE_STATE.finalOpacity : PAGE_TRANSITION_PAGE_STATE.initialOpacity,
    y: visible ? PAGE_TRANSITION_PAGE_STATE.finalY : initialY,
  }
}

export function getRouteSceneChildDelay({
  index,
  prefersReducedMotion,
  stage,
  stagger,
}: {
  index: number
  prefersReducedMotion: boolean
  stage: number
  stagger: number
}) {
  if (prefersReducedMotion || stage < PAGE_TRANSITION_STAGE.children) return 0

  return index * stagger
}
