'use client'

import { useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { MOTION_SPRING_SNAPPY } from '@/lib/motion'
import ResumeModal from './ResumeModal'
import AnimatedDashedArrow from './AnimatedDashedArrow'
import { useWebHaptics } from 'web-haptics/react'
import { Magnetic } from '@/components/animate-ui/primitives/effects/magnetic'
import {
  RESUME_BUTTON_CLASS_NAME,
  RESUME_BUTTON_IDLE_VARIANT,
  RESUME_BUTTON_LABEL,
  RESUME_BUTTON_MAGNETIC_RANGE,
  RESUME_BUTTON_MAGNETIC_STRENGTH,
  RESUME_BUTTON_STYLE,
  RESUME_BUTTON_TEXT_CLASS_NAME,
  RESUME_BUTTON_VARIANTS,
  getResumeButtonHoverVariant,
  getResumeButtonTapMotion,
  getResumeButtonTextVariants,
  openResumeButtonModal,
} from '@/lib/resume-button'

export default function ResumeButton() {
  const [isOpen, setIsOpen] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()

  return (
    <>
      <Magnetic strength={RESUME_BUTTON_MAGNETIC_STRENGTH} range={RESUME_BUTTON_MAGNETIC_RANGE} onlyOnHover disableOnTouch>
        <m.button
          type="button"
          onClick={() =>
            openResumeButtonModal({
              setOpen: setIsOpen,
              triggerHaptic: (style) => haptic.trigger(style),
            })
          }
          className={RESUME_BUTTON_CLASS_NAME}
          style={RESUME_BUTTON_STYLE}
          initial={RESUME_BUTTON_IDLE_VARIANT}
          whileHover={getResumeButtonHoverVariant(prefersReducedMotion)}
          animate={RESUME_BUTTON_IDLE_VARIANT}
          whileTap={getResumeButtonTapMotion(prefersReducedMotion)}
          transition={MOTION_SPRING_SNAPPY}
          variants={RESUME_BUTTON_VARIANTS}
        >
          <m.span
            className={RESUME_BUTTON_TEXT_CLASS_NAME}
            variants={getResumeButtonTextVariants(prefersReducedMotion)}
          >
            {RESUME_BUTTON_LABEL}
          </m.span>
          <AnimatedDashedArrow size={13} />
        </m.button>
      </Magnetic>
      <ResumeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
