import assert from 'node:assert/strict'
import test from 'node:test'

import {
  RESUME_BUTTON_CLASS_NAME,
  RESUME_BUTTON_HAPTIC_STYLE,
  RESUME_BUTTON_HOVER_VARIANT,
  RESUME_BUTTON_IDLE_VARIANT,
  RESUME_BUTTON_LABEL,
  RESUME_BUTTON_MAGNETIC_RANGE,
  RESUME_BUTTON_MAGNETIC_STRENGTH,
  RESUME_BUTTON_STYLE,
  RESUME_BUTTON_TAP_MOTION,
  RESUME_BUTTON_TEXT_CLASS_NAME,
  RESUME_BUTTON_TEXT_VARIANTS,
  RESUME_BUTTON_VARIANTS,
  getResumeButtonHoverVariant,
  getResumeButtonTapMotion,
  getResumeButtonTextVariants,
  openResumeButtonModal,
} from './resume-button.ts'

test('resume button constants preserve label, magnetic field, and chrome', () => {
  assert.equal(RESUME_BUTTON_LABEL, 'Resume')
  assert.equal(RESUME_BUTTON_MAGNETIC_STRENGTH, 0.15)
  assert.equal(RESUME_BUTTON_MAGNETIC_RANGE, 100)
  assert.equal(RESUME_BUTTON_HAPTIC_STYLE, 'light')
  assert.equal(RESUME_BUTTON_IDLE_VARIANT, 'idle')
  assert.equal(RESUME_BUTTON_HOVER_VARIANT, 'hover')
  assert.deepEqual(RESUME_BUTTON_STYLE, { fontFamily: 'inherit' })
  assert.match(RESUME_BUTTON_CLASS_NAME, /playground-joy/)
  assert.match(RESUME_BUTTON_CLASS_NAME, /focus-visible:outline-primary/)
  assert.equal(RESUME_BUTTON_TEXT_CLASS_NAME, 'relative z-10')
})

test('resume button motion constants preserve hover and tap feel', () => {
  assert.deepEqual(RESUME_BUTTON_TAP_MOTION, { scale: 0.96, y: 0 })
  assert.deepEqual(RESUME_BUTTON_VARIANTS, {
    idle: { y: 0 },
    hover: { y: -3 },
  })
  assert.deepEqual(RESUME_BUTTON_TEXT_VARIANTS, {
    idle: { letterSpacing: '0.06em' },
    hover: {
      letterSpacing: '0.1em',
      transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] },
    },
  })
})

test('resume button helpers disable nonessential motion for reduced-motion users', () => {
  assert.equal(getResumeButtonHoverVariant(false), 'hover')
  assert.equal(getResumeButtonHoverVariant(true), undefined)
  assert.deepEqual(getResumeButtonTapMotion(false), RESUME_BUTTON_TAP_MOTION)
  assert.equal(getResumeButtonTapMotion(true), undefined)
  assert.deepEqual(getResumeButtonTextVariants(false), RESUME_BUTTON_TEXT_VARIANTS)
  assert.equal(getResumeButtonTextVariants(true), undefined)
})

test('resume button open action triggers haptics before opening the modal', () => {
  const calls: Array<string | boolean> = []

  openResumeButtonModal({
    setOpen: (isOpen) => calls.push(isOpen),
    triggerHaptic: (style) => calls.push(style),
  })

  assert.deepEqual(calls, ['light', true])
})
