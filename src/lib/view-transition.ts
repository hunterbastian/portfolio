/**
 * Native shared-element morphs between a project card and the detail hero,
 * built on the View Transitions API.
 *
 * A view-transition-name has to be unique across the document, so exactly one
 * element may carry PROJECT_MORPH_NAME at a time. This module-level store holds
 * the slug currently being morphed:
 *
 *   1. Card click → setProjectMorphSlug(slug), flushed before the snapshot
 *   2. Browser captures the outgoing page with that card named
 *   3. Router commits → the detail hero reads the same slug and takes the name
 *   4. Browser pairs the two snapshots and morphs card → hero
 *
 * Both directions run through the same path, so the breadcrumb back to the
 * index morphs the hero down onto its card the same way.
 */

export const PROJECT_MORPH_NAME = 'project-hero'

/**
 * How long to let the incoming hero decode before handing the frame to the
 * browser. The snapshot is taken the moment this resolves, so an image that is
 * still blank would morph into an empty box; capping the wait keeps a slow
 * image from stalling the navigation instead.
 */
export const PROJECT_MORPH_TARGET_WAIT_MS = 240

/** Marks the element carrying the name so the wait can find it without a style query. */
export const PROJECT_MORPH_TARGET_ATTRIBUTE = 'data-project-morph'

/**
 * A view transition holds the outgoing frame on screen until its callback
 * settles, so a navigation that never commits would leave the page looking
 * frozen. This is the backstop that releases it.
 */
export const PROJECT_MORPH_NAVIGATION_TIMEOUT_MS = 1200

export interface NavigationModifiers {
  altKey: boolean
  button: number
  ctrlKey: boolean
  metaKey: boolean
  shiftKey: boolean
}

export interface MorphNavigationInput {
  modifiers: NavigationModifiers
  prefersReducedMotion: boolean
  supportsViewTransitions: boolean
}

let morphSlug: string | null = null
const listeners = new Set<() => void>()

export function setProjectMorphSlug(slug: string | null) {
  if (morphSlug === slug) return

  morphSlug = slug
  listeners.forEach((listener) => listener())
}

export function getProjectMorphSlug() {
  return morphSlug
}

/** The server never has a morph in flight, so the name is always absent in HTML. */
export function getProjectMorphServerSnapshot(): string | null {
  return null
}

export function subscribeProjectMorph(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

/**
 * Opening a link in a new tab or window leaves the current document in place,
 * so there is nothing to morph and the browser default must be preserved.
 */
export function isModifiedNavigation(modifiers: NavigationModifiers): boolean {
  return (
    modifiers.metaKey ||
    modifiers.ctrlKey ||
    modifiers.shiftKey ||
    modifiers.altKey ||
    modifiers.button !== 0
  )
}

export function shouldMorphNavigation({
  modifiers,
  prefersReducedMotion,
  supportsViewTransitions,
}: MorphNavigationInput): boolean {
  if (!supportsViewTransitions || prefersReducedMotion) {
    return false
  }

  return !isModifiedNavigation(modifiers)
}

/**
 * Only the slug being morphed gets the name; every other card renders without
 * one so the document never holds a duplicate.
 */
export function getProjectMorphName(slug: string, activeSlug: string | null): string | undefined {
  return activeSlug === slug ? PROJECT_MORPH_NAME : undefined
}

export interface ProjectMorphElementProps {
  [PROJECT_MORPH_TARGET_ATTRIBUTE]?: 'true'
  style?: { viewTransitionName: string }
}

/** Spreadable props for whichever element should morph, empty when it should not. */
export function getProjectMorphProps(
  slug: string,
  activeSlug: string | null,
): ProjectMorphElementProps {
  const name = getProjectMorphName(slug, activeSlug)

  if (!name) {
    return {}
  }

  return {
    [PROJECT_MORPH_TARGET_ATTRIBUTE]: 'true',
    style: { viewTransitionName: name },
  }
}
