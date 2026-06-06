import assert from 'node:assert/strict'
import test from 'node:test'

import { getArcGlossUploadButtonClassNames } from './arc-gloss-upload-button.ts'

const buttonClass = 'button_hash'
const fullViewportClass = 'fullViewport_hash'
const stageClass = 'stage_hash'

test('arc gloss upload button classes include viewport fill by default', () => {
  assert.deepEqual(
    getArcGlossUploadButtonClassNames({
      buttonClass,
      className: undefined,
      containerClassName: undefined,
      fillViewport: true,
      fullViewportClass,
      stageClass,
    }),
    {
      buttonClassName: 'button_hash',
      stageClassName: 'stage_hash fullViewport_hash',
    },
  )
})

test('arc gloss upload button classes preserve caller classes without empty gaps', () => {
  assert.deepEqual(
    getArcGlossUploadButtonClassNames({
      buttonClass,
      className: 'custom-button',
      containerClassName: 'custom-stage',
      fillViewport: false,
      fullViewportClass,
      stageClass,
    }),
    {
      buttonClassName: 'button_hash custom-button',
      stageClassName: 'stage_hash custom-stage',
    },
  )
})
