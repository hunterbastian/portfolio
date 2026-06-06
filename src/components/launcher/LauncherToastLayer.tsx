'use client'

import { AnimatePresence, m } from 'framer-motion'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import type { LauncherToast } from '@/lib/launcher'

interface LauncherToastLayerProps {
  prefersReducedMotion: boolean
  toast: LauncherToast | null
}

export function LauncherToastLayer({ prefersReducedMotion, toast }: LauncherToastLayerProps) {
  return (
    <AnimatePresence initial={false}>
      {toast ? (
        <m.div
          key={toast.id}
          role="status"
          aria-live="polite"
          className="fixed inset-x-0 bottom-16 z-[2147483001] flex justify-center px-5 sm:bottom-5"
          initial={{ opacity: 0, y: 8, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 8, scale: 0.98 }}
          transition={{ duration: motionDurationMs(180, prefersReducedMotion), ease: MOTION_EASE_SOFT }}
        >
          <div className="border border-border/80 bg-background/92 px-3.5 py-2 font-mono text-[0.74rem] text-foreground shadow-[0_14px_40px_-30px_rgba(15,23,42,0.5)] backdrop-blur-xl">
            {toast.message}
          </div>
        </m.div>
      ) : null}
    </AnimatePresence>
  )
}
