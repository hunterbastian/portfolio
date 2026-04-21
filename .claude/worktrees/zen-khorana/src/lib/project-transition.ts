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
