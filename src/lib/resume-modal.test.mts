import assert from 'node:assert/strict'
import test from 'node:test'

import {
  RESUME_MODAL_COPY,
  RESUME_MODAL_CONTENT_MOTION,
  RESUME_MODAL_CONTENT_TRANSITION,
  RESUME_MODAL_DOWNLOAD_ACTION,
  RESUME_MODAL_DOWNLOAD_HREF,
  RESUME_MODAL_FILE_HREF,
  RESUME_MODAL_HAPTIC_STYLE,
  RESUME_MODAL_META_ITEMS,
  RESUME_MODAL_OVERLAY_MOTION,
  RESUME_MODAL_OVERLAY_TRANSITION,
  RESUME_MODAL_VIEW_ACTION,
  activateResumeModalClose,
  activateResumeModalDownload,
  activateResumeModalView,
  isResumeModalCloseKey,
} from './resume-modal.ts'

test('resume modal copy and file routes stay stable', () => {
  assert.equal(RESUME_MODAL_COPY.dialogLabel, 'Resume')
  assert.equal(RESUME_MODAL_COPY.closeToast, 'Resume closed')
  assert.equal(RESUME_MODAL_COPY.downloadToast, 'Downloading resume')
  assert.equal(RESUME_MODAL_FILE_HREF, '/api/resume/file')
  assert.equal(RESUME_MODAL_DOWNLOAD_HREF, '/api/resume/file?download=1')
})

test('resume modal metadata items preserve display order', () => {
  assert.deepEqual([...RESUME_MODAL_META_ITEMS], [
    { label: 'File', value: 'PDF available' },
    { label: 'Access', value: 'Public' },
    { label: 'Close', value: 'Esc anytime' },
    { label: 'Download', value: 'You choose' },
  ])
})

test('resume modal action and close-key helpers preserve behavior', () => {
  assert.equal(RESUME_MODAL_VIEW_ACTION, 'view')
  assert.equal(RESUME_MODAL_DOWNLOAD_ACTION, 'download')
  assert.equal(RESUME_MODAL_HAPTIC_STYLE, 'light')
  assert.equal(isResumeModalCloseKey('Escape'), true)
  assert.equal(isResumeModalCloseKey('Enter'), false)
  assert.equal(isResumeModalCloseKey('Esc'), false)
})

test('activateResumeModalClose preserves haptic, toast, and close ordering', () => {
  const calls: unknown[] = []

  activateResumeModalClose({
    closeModal: () => calls.push('close'),
    showToast: (message) => calls.push(['toast', message]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['toast', 'Resume closed'],
    'close',
  ])
})

test('activateResumeModalDownload preserves haptic, analytics, and toast ordering', () => {
  const calls: unknown[] = []

  activateResumeModalDownload({
    showToast: (message) => calls.push(['toast', message]),
    trackResumeAction: (action) => calls.push(['resume', action]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['resume', 'download'],
    ['toast', 'Downloading resume'],
  ])
})

test('activateResumeModalView tracks only open modal views', () => {
  const calls: unknown[] = []

  assert.equal(
    activateResumeModalView({
      isOpen: false,
      trackResumeAction: (action) => calls.push(['resume', action]),
    }),
    false,
  )
  assert.deepEqual(calls, [])

  assert.equal(
    activateResumeModalView({
      isOpen: true,
      trackResumeAction: (action) => calls.push(['resume', action]),
    }),
    true,
  )
  assert.deepEqual(calls, [['resume', 'view']])
})

test('resume modal motion constants preserve overlay and content choreography', () => {
  assert.deepEqual(RESUME_MODAL_OVERLAY_MOTION.initial, { opacity: 0 })
  assert.deepEqual(RESUME_MODAL_OVERLAY_MOTION.animate, { opacity: 1 })
  assert.equal(RESUME_MODAL_OVERLAY_TRANSITION.duration, 0.18)
  assert.equal(RESUME_MODAL_OVERLAY_TRANSITION.ease, 'easeOut')
  assert.deepEqual(RESUME_MODAL_CONTENT_MOTION.initial, { opacity: 0, y: 8, scale: 0.98 })
  assert.deepEqual(RESUME_MODAL_CONTENT_MOTION.animate, { opacity: 1, y: 0, scale: 1 })
  assert.deepEqual(RESUME_MODAL_CONTENT_MOTION.exit, { opacity: 0, y: 8, scale: 0.98 })
  assert.equal(RESUME_MODAL_CONTENT_TRANSITION.duration, 0.22)
  assert.deepEqual(RESUME_MODAL_CONTENT_TRANSITION.ease, [0.16, 1, 0.3, 1])
})
