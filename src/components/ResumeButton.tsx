'use client'

import { useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_SPRING_SNAPPY } from '@/lib/motion'
import ResumeModal from './ResumeModal'
import AnimatedDashedArrow from './AnimatedDashedArrow'
import { useWebHaptics } from 'web-haptics/react'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'

export default function ResumeButton() {
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()

  return (
    <>
      <Magnetic strength={0.15} range={100} onlyOnHover disableOnTouch>
      <m.button
        type="button"
        onClick={() => { haptic.trigger('light'); setIsOpen(true) }}
        className="playground-joy group relative inline-flex items-center gap-2 overflow-hidden rounded-full px-5 py-2.5 text-[10px] font-medium uppercase tracking-[0.08em] focus-visible:outline-2 focus-visible:outline-primary focus-visible:outline-offset-2"
        style={{ fontFamily: 'inherit' }}
        initial="idle"
        whileHover={prefersReducedMotion ? undefined : 'hover'}
        animate="idle"
        whileTap={prefersReducedMotion ? undefined : { scale: 0.96, y: 0 }}
        transition={MOTION_SPRING_SNAPPY}
        variants={{ idle: { y: 0 }, hover: { y: -3 } }}
      >
        <m.span
          className="relative z-10"
          variants={prefersReducedMotion ? undefined : {
            idle: { letterSpacing: '0.06em' },
            hover: { letterSpacing: '0.1em', transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } },
          }}
        >
          Resume
        </m.span>
        <AnimatedDashedArrow size={14} />
      </m.button>
      </Magnetic>
      <ResumeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
