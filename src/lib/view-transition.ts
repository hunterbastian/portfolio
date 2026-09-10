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
 * How long to wait for the destination element to turn up. Without it there is
 * nothing to morph to and the photo would simply fade away, so this budget is
 * generous enough to cover a route that has to render a whole index page.
 */
export const PROJECT_MORPH_TARGET_WAIT_MS = 500

/**
 * How much longer to give that element's photo once it exists. Short on
 * purpose: the outgoing snapshot stays on screen through the crossfade and
 * covers a photo that arrives late, so spending the full budget here would
 * delay every morph to guard against a flash the viewer rarely sees.
 */
export const PROJECT_MORPH_IMAGE_WAIT_MS = 150

/**
 * Roughly a frame. The wait cannot use requestAnimationFrame because the
 * browser stops producing frames while a view transition holds its callback.
 */
export const PROJECT_MORPH_TARGET_POLL_MS = 16

/** Marks the element carrying the name so the wait can find it without a style query. */
export const PROJECT_MORPH_TARGET_ATTRIBUTE = 'data-project-morph'

/**
 * A view transition holds the outgoing frame on screen until its callback
 * settles, so a route that is slow to commit would leave the page looking
 * frozen. Past this point the morph is abandoned and the navigation finishes
 * plainly — a route that has not arrived yet has no hero to land on, and a
 * morph captured against a half-built page is worse than none.
 */
export const PROJECT_MORPH_NAVIGATION_TIMEOUT_MS = 900

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

export interface MorphSettleInput {
  imageReady: boolean
  msSinceStart: number
  /** Null until the destination element has been found. */
  msSinceTargetFound: number | null
}

/**
 * Decides when the navigation may hand its frame to the browser. Two clocks,
 * because a missing element and a missing photo are not the same problem: the
 * element is what the morph needs to exist at all, while its photo only has to
 * beat the crossfade.
 */
export function shouldSettleMorph({
  imageReady,
  msSinceStart,
  msSinceTargetFound,
}: MorphSettleInput): boolean {
  if (msSinceStart >= PROJECT_MORPH_TARGET_WAIT_MS) {
    return true
  }

  if (msSinceTargetFound === null) {
    return false
  }

  return imageReady || msSinceTargetFound >= PROJECT_MORPH_IMAGE_WAIT_MS
}

export interface MorphTargetVisibilityInput {
  bottom: number
  top: number
  viewportHeight: number
}

/**
 * A morph whose destination sits below the fold reads as the photo flying off
 * the screen, which is what happens coming back to an index that has scrolled
 * to the top. Whole-element visibility is the bar rather than any visibility at
 * all: a card with a sliver showing past the bottom edge is somewhere the photo
 * should not be landing either. Targets already settled on screen are left
 * alone, because pulling the detail hero to the middle of the window would
 * fight its natural landing at the top of the page.
 */
export function isMorphTargetInView({
  bottom,
  top,
  viewportHeight,
}: MorphTargetVisibilityInput): boolean {
  if (bottom - top > viewportHeight) {
    // Taller than the window, so it can never fit — covering it will do.
    return top <= 0 && bottom >= viewportHeight
  }

  return top >= 0 && bottom <= viewportHeight
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
