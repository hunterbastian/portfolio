'use client'

import { usePathname, useRouter } from 'next/navigation'
import {
  createContext,
  startTransition,
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
  PROJECT_MORPH_TARGET_WAIT_MS,
  setProjectMorphSlug,
  shouldMorphNavigation,
  type NavigationModifiers,
} from '@/lib/view-transition'

/** Returns true when the morph took over navigation and the link should not follow. */
type MorphNavigate = (href: string, slug: string, modifiers: NavigationModifiers) => boolean

const MorphNavigationContext = createContext<MorphNavigate | null>(null)

export function useProjectMorph() {
  return useContext(MorphNavigationContext)
}

/**
 * Resolves once the incoming hero has pixels, so the browser snapshots a loaded
 * image rather than an empty box. Gives up at the cap — a late image is a worse
 * outcome than a slightly plainer morph.
 */
function waitForMorphTarget(): Promise<void> {
  return new Promise((resolve) => {
    const deadline = performance.now() + PROJECT_MORPH_TARGET_WAIT_MS

    const poll = () => {
      const image = document.querySelector(`[${PROJECT_MORPH_TARGET_ATTRIBUTE}="true"] img`)
      const ready = image instanceof HTMLImageElement && image.complete

      if (ready || performance.now() >= deadline) {
        resolve()
        return
      }

      requestAnimationFrame(poll)
    }

    requestAnimationFrame(poll)
  })
}

export default function ViewTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const settle = useRef<(() => void) | null>(null)
  const backstop = useRef<number | null>(null)

  const release = useCallback(() => {
    if (backstop.current !== null) {
      window.clearTimeout(backstop.current)
      backstop.current = null
    }

    settle.current?.()
    settle.current = null
  }, [])

  // The router has committed the new route by the time the pathname changes,
  // which is the earliest point the destination hero exists to be snapshotted.
  useEffect(() => {
    if (!settle.current) return

    let cancelled = false
    waitForMorphTarget().then(() => {
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

      const transition = document.startViewTransition(
        () =>
          new Promise<void>((resolve) => {
            settle.current = resolve
            backstop.current = window.setTimeout(release, PROJECT_MORPH_NAVIGATION_TIMEOUT_MS)
            startTransition(() => router.push(href))
          }),
      )

      transition.finished.finally(() => setProjectMorphSlug(null))

      return true
    },
    [release, router],
  )

  const value = useMemo(() => morphTo, [morphTo])

  return <MorphNavigationContext.Provider value={value}>{children}</MorphNavigationContext.Provider>
}
