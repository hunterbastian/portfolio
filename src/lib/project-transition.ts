/**
 * Lightweight module-level store for shared-element transitions between
 * the project card grid and the project detail page.
 *
 * Data flow:
 *   1. Card click → startProjectTransition() with source rect
 *   2. Detail page mounts → setProjectTransitionTarget() with measured hero rect
 *   3. Overlay animates source → target → markCompleting() → hero fades in
 *   4. clearProjectTransition() removes all data
 */

export interface TransitionRect {
  top: number
  left: number
  width: number
  height: number
}

export type ProjectTransitionOverlayPhase = 'hold' | 'fly' | 'fade'
export type ProjectTransitionOverlayCompletionAction = 'fade' | 'clear'

export interface ProjectTransitionOverlayFrame extends TransitionRect {
  borderRadius: number
  opacity: number
}

export interface ProjectTransitionOverlayPhaseUpdateInput {
  phase: ProjectTransitionOverlayPhase
  setPhase: (phase: ProjectTransitionOverlayPhase) => void
}

export interface ProjectTransitionOverlayResetInput extends Pick<ProjectTransitionOverlayPhaseUpdateInput, 'setPhase'> {
  transition: ProjectTransitionState | null
}

export interface ProjectTransitionOverlayTargetInput extends ProjectTransitionOverlayPhaseUpdateInput {
  clearTransition: () => void
  markCompleting: () => void
  prefersReducedMotion: boolean
  transition: ProjectTransitionState | null
}

export interface ProjectTransitionHoldFallbackInput<TTimer> extends Pick<ProjectTransitionOverlayPhaseUpdateInput, 'phase'> {
  clearTransition: () => void
  markCompleting: () => void
  schedule: (delay: number, callback: () => void) => TTimer
  transition: ProjectTransitionState | null
}

export interface ProjectTransitionPathChangeInput {
  clearTransition: () => void
  pathname: string
  transition: ProjectTransitionState | null
}

export interface ProjectTransitionOverlayCompletionInput extends ProjectTransitionOverlayPhaseUpdateInput {
  clearTransition: () => void
  markCompleting: () => void
}

export const PROJECT_TRANSITION_FLY_DURATION = 0.48
export const PROJECT_TRANSITION_FADE_DURATION = 0.22
export const PROJECT_TRANSITION_HOLD_TIMEOUT_MS = 2000
export const PROJECT_TRANSITION_CLEAR_DELAY_MS = 300
export const PROJECT_TRANSITION_HOLD_RADIUS = 12
export const PROJECT_TRANSITION_TARGET_RADIUS = 3
export const PROJECT_TRANSITION_OVERLAY_ROOT_CLASS_NAME =
  'pointer-events-none fixed z-[100] overflow-hidden will-change-[top,left,width,height]'
export const PROJECT_TRANSITION_OVERLAY_IMAGE_CLASS_NAME = 'object-cover'
export const PROJECT_TRANSITION_OVERLAY_IMAGE_SIZES = '(max-width: 640px) 100vw, 560px'
export const PROJECT_TRANSITION_OVERLAY_IMAGE_QUALITY = 90

export interface ProjectTransitionState {
  /** Monotonic counter — changes on every startProjectTransition call, even same slug */
  id: number
  slug: string
  imageSrc: string
  sourceRect: TransitionRect
  targetRect: TransitionRect | null
  /** When true, the overlay is fading out and the hero should start fading in */
  completing: boolean
}

let nextId = 0
let current: ProjectTransitionState | null = null
const listeners = new Set<() => void>()

function emit() {
  listeners.forEach((fn) => fn())
}

export function startProjectTransition(
  slug: string,
  imageSrc: string,
  sourceRect: TransitionRect,
) {
  current = { id: ++nextId, slug, imageSrc, sourceRect, targetRect: null, completing: false }
  emit()
}

export function setProjectTransitionTarget(targetRect: TransitionRect) {
  if (!current) return
  current = { ...current, targetRect }
  emit()
}

export function markProjectTransitionCompleting() {
  if (!current) return
  current = { ...current, completing: true }
  emit()
}

export function clearProjectTransition() {
  current = null
  emit()
}

export function getProjectTransition() {
  return current
}

export function subscribeProjectTransition(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

export function getProjectTransitionOverlayRect(
  phase: ProjectTransitionOverlayPhase,
  transition: ProjectTransitionState,
): TransitionRect {
  return (phase === 'fly' || phase === 'fade') && transition.targetRect
    ? transition.targetRect
    : transition.sourceRect
}

export function getProjectTransitionOverlayDuration(phase: ProjectTransitionOverlayPhase): number {
  if (phase === 'fly') return PROJECT_TRANSITION_FLY_DURATION
  if (phase === 'fade') return PROJECT_TRANSITION_FADE_DURATION

  return 0
}

export function getProjectTransitionOverlayBorderRadius(phase: ProjectTransitionOverlayPhase): number {
  return phase === 'hold' ? PROJECT_TRANSITION_HOLD_RADIUS : PROJECT_TRANSITION_TARGET_RADIUS
}

export function getProjectTransitionOverlayOpacity(phase: ProjectTransitionOverlayPhase): number {
  return phase === 'fade' ? 0 : 1
}

export function getProjectTransitionOverlayInitialFrame(
  transition: ProjectTransitionState,
): ProjectTransitionOverlayFrame {
  return {
    ...transition.sourceRect,
    borderRadius: PROJECT_TRANSITION_HOLD_RADIUS,
    opacity: 1,
  }
}

export function getProjectTransitionOverlayAnimateFrame(
  phase: ProjectTransitionOverlayPhase,
  transition: ProjectTransitionState,
): ProjectTransitionOverlayFrame {
  return {
    ...getProjectTransitionOverlayRect(phase, transition),
    borderRadius: getProjectTransitionOverlayBorderRadius(phase),
    opacity: getProjectTransitionOverlayOpacity(phase),
  }
}

export function getProjectTransitionOverlayCompletionAction(
  phase: ProjectTransitionOverlayPhase,
): ProjectTransitionOverlayCompletionAction | null {
  if (phase === 'fly') return 'fade'
  if (phase === 'fade') return 'clear'

  return null
}

export function resetProjectTransitionOverlayPhase({
  setPhase,
  transition,
}: ProjectTransitionOverlayResetInput) {
  if (transition && !transition.targetRect && !transition.completing) {
    setPhase('hold')
  }
}

export function activateProjectTransitionOverlayTarget({
  clearTransition,
  markCompleting,
  phase,
  prefersReducedMotion,
  setPhase,
  transition,
}: ProjectTransitionOverlayTargetInput) {
  if (!transition?.targetRect || phase !== 'hold') {
    return
  }

  if (prefersReducedMotion) {
    markCompleting()
    clearTransition()
    return
  }

  setPhase('fly')
}

export function scheduleProjectTransitionHoldFallback<TTimer>({
  clearTransition,
  markCompleting,
  phase,
  schedule,
  transition,
}: ProjectTransitionHoldFallbackInput<TTimer>): TTimer[] {
  if (!transition || phase !== 'hold') {
    return []
  }

  const timers: TTimer[] = []

  timers.push(
    schedule(PROJECT_TRANSITION_HOLD_TIMEOUT_MS, () => {
      markCompleting()
      timers.push(schedule(PROJECT_TRANSITION_CLEAR_DELAY_MS, clearTransition))
    }),
  )

  return timers
}

export function clearProjectTransitionForPath({
  clearTransition,
  pathname,
  transition,
}: ProjectTransitionPathChangeInput) {
  if (transition && shouldClearProjectTransitionForPath(pathname, transition)) {
    clearTransition()
  }
}

export function activateProjectTransitionOverlayCompletion({
  clearTransition,
  markCompleting,
  phase,
  setPhase,
}: ProjectTransitionOverlayCompletionInput) {
  const action = getProjectTransitionOverlayCompletionAction(phase)

  if (action === 'fade') {
    markCompleting()
    setPhase('fade')
  } else if (action === 'clear') {
    clearTransition()
  }
}

export function shouldClearProjectTransitionForPath(
  pathname: string,
  transition: ProjectTransitionState,
): boolean {
  return !pathname.startsWith(`/projects/${transition.slug}`)
}
