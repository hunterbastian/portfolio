'use client'

import { AnimatePresence, m } from 'framer-motion'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import type { EmptySpaceRipple } from '@/lib/launcher'

interface LauncherRippleLayerProps {
  ripples: EmptySpaceRipple[]
}

export function LauncherRippleLayer({ ripples }: LauncherRippleLayerProps) {
  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[35] overflow-hidden">
      <AnimatePresence initial={false}>
        {ripples.map((ripple) => (
          <m.span
            key={ripple.id}
            className="absolute h-28 w-28 rounded-full border border-[#ff4b00]/10 bg-[#ff4b00]/[0.025] shadow-[0_0_36px_rgba(255,75,0,0.05)]"
            style={{
              left: ripple.x,
              top: ripple.y,
              translateX: '-50%',
              translateY: '-50%',
            }}
            initial={{ opacity: 0, scale: 0.2, filter: 'blur(2px)' }}
            animate={{ opacity: [0, 0.26, 0], scale: [0.2, 0.74, 1.25], filter: ['blur(3px)', 'blur(1px)', 'blur(8px)'] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.72, ease: MOTION_EASE_SOFT }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}
