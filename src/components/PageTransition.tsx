'use client'

import { AnimatePresence, m, useReducedMotion } from 'framer-motion'
import { usePathname } from 'next/navigation'
import type { ReactNode } from 'react'
import { MOTION_EASE_SOFT, MOTION_EASE_EXIT } from '@/lib/motion'
import { useIsInitialLoad } from '@/lib/initial-load'
import { PAGE_TRANSITION_TIMING, getPageTransitionInitial } from '@/lib/page-transition'

function RouteScene({ children, pathname }: { children: ReactNode; pathname: string }) {
  const prefersReducedMotion = useReducedMotion() ?? false
  // This hook belongs to the keyed scene so subsequent routes can animate.
  const isInitialLoad = useIsInitialLoad()

  return (
    <m.div
      className="route-scene"
      data-route-scene={pathname}
      initial={getPageTransitionInitial(isInitialLoad, prefersReducedMotion)}
      animate={{ opacity: 1, y: 0 }}
      exit={{
        opacity: prefersReducedMotion ? 1 : 0,
        transition: {
          duration: prefersReducedMotion ? 0 : PAGE_TRANSITION_TIMING.exit / 1000,
          ease: MOTION_EASE_EXIT,
        },
      }}
      transition={{
        duration: prefersReducedMotion ? 0 : PAGE_TRANSITION_TIMING.enter / 1000,
        ease: MOTION_EASE_SOFT,
      }}
    >
      {children}
    </m.div>
  )
}

export default function PageTransition({ children }: { children: ReactNode }) {
  const pathname = usePathname()

  return (
    <AnimatePresence mode="wait" initial={false}>
      <RouteScene key={pathname} pathname={pathname}>
        {children}
      </RouteScene>
    </AnimatePresence>
  )
}
