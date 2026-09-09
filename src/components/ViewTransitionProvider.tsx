'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  type ReactNode,
} from 'react'
import { flushSync } from 'react-dom'
import {
  PROJECT_MORPH_NAVIGATION_TIMEOUT_MS,
  PROJECT_MORPH_TARGET_ATTRIBUTE,
  PROJECT_MORPH_TARGET_POLL_MS,
  isMorphTargetInView,
  setProjectMorphSlug,
  shouldMorphNavigation,
  shouldSettleMorph,
  type NavigationModifiers,
} from '@/lib/view-transition'

/** Returns true when the morph took over navigation and the link should not follow. */
type MorphNavigate = (href: string, slug: string, modifiers: NavigationModifiers) => boolean

const MorphNavigationContext = createContext<MorphNavigate | null>(null)

export function useProjectMorph() {
  return useContext(MorphNavigationContext)
}

/**
 * The browser captures the incoming frame the moment the transition callback
 * settles, so everything the morph needs has to be true by then: the target has
 * to exist, be on screen, and have pixels. Gives up at the cap — a late image is
 * a worse outcome than a slightly plainer morph.
 */
function waitForMorphTarget(source: Element | null): Promise<void> {
  return new Promise((resolve) => {
    const start = performance.now()
    let foundAt: number | null = null
    let scrolled = false

    const poll = () => {
      // The outgoing element is still mounted and still carries the name at
      // this point, so anything matching it is the page being left behind.
      // Only a different element is the destination worth waiting for.
      const named = document.querySelectorAll(`[${PROJECT_MORPH_TARGET_ATTRIBUTE}="true"]`)
      const target = [...named].find((element) => element !== source) ?? null

      if (target && !scrolled) {
        scrolled = true
        const rect = target.getBoundingClientRect()

        if (!isMorphTargetInView({
          bottom: rect.bottom,
          top: rect.top,
          viewportHeight: window.innerHeight,
        })) {
          // Instant, because a smooth scroll would still be moving when the
          // frame is captured and the morph would land short.
          target.scrollIntoView({ block: 'center', behavior: 'instant' })
        }
      }

      const now = performance.now()

      if (target && foundAt === null) {
        foundAt = now
      }

      const image = target?.querySelector('img')

      if (shouldSettleMorph({
        imageReady: image instanceof HTMLImageElement && image.complete,
        msSinceStart: now - start,
        msSinceTargetFound: foundAt === null ? null : now - foundAt,
      })) {
        resolve()
        return
      }

      // Deliberately a timer and not requestAnimationFrame: the browser stops
      // producing frames while a view transition waits on its callback, so an
      // rAF loop here never runs and the navigation deadlocks until the backstop.
      window.setTimeout(poll, PROJECT_MORPH_TARGET_POLL_MS)
    }

    poll()
  })
}

export default function ViewTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const settle = useRef<(() => void) | null>(null)
  const backstop = useRef<number | null>(null)
  const active = useRef<ViewTransition | null>(null)
  const source = useRef<Element | null>(null)

  const release = useCallback(() => {
    if (backstop.current !== null) {
      window.clearTimeout(backstop.current)
      backstop.current = null
    }

    settle.current?.()
    settle.current = null
  }, [])

  /** Abandon a morph whose route never arrived, leaving an ordinary navigation. */
  const abandon = useCallback(() => {
    active.current?.skipTransition()
    release()
  }, [release])

  // The router has committed the new route by the time the pathname changes,
  // which is the earliest point the destination hero exists to be snapshotted.
  useEffect(() => {
    if (!settle.current) return

    let cancelled = false
    waitForMorphTarget(source.current).then(() => {
      if (!cancelled) release()
    })

    return () => {
      cancelled = true
      release()
    }
  }, [pathname, release])

  const morphTo = useCallback<MorphNavigate>(
    (href, slug, modifiers) => {
      const supportsViewTransitions = typeof document.startViewTransition === 'function'
      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

      if (!shouldMorphNavigation({ modifiers, prefersReducedMotion, supportsViewTransitions })) {
        return false
      }

      // The outgoing frame is captured before the callback runs, so the name has
      // to be committed to the DOM now rather than on React's next tick.
      flushSync(() => setProjectMorphSlug(slug))
      source.current = document.querySelector(`[${PROJECT_MORPH_TARGET_ATTRIBUTE}="true"]`)

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            settle.current = resolve
            backstop.current = window.setTimeout(abandon, PROJECT_MORPH_NAVIGATION_TIMEOUT_MS)
            router.push(href)
          }),
      )

      active.current = transition
      transition.finished.finally(() => {
        active.current = null
        source.current = null
        setProjectMorphSlug(null)
      })

      return true
    },
    [abandon, router],
  )

  const value = useMemo(() => morphTo, [morphTo])

  return <MorphNavigationContext.Provider value={value}>{children}</MorphNavigationContext.Provider>
}
