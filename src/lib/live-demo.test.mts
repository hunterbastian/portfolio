import assert from 'node:assert/strict'
import test from 'node:test'

import {
  LIVE_DEMO_DEFAULT_ASPECT_RATIO,
  LIVE_DEMO_FALLBACK_LINK_LABEL,
  LIVE_DEMO_LOAD_BUTTON_LABEL,
  LIVE_DEMO_PANEL_DURATION_MS,
  LIVE_DEMO_PANEL_ENTER_STATE,
  LIVE_DEMO_PANEL_EXIT_STATE,
  getLiveDemoLoadAriaLabel,
  getLiveDemoPanelAnimationState,
} from './live-demo.ts'

test('live demo helpers preserve load and fallback copy', () => {
  assert.equal(LIVE_DEMO_LOAD_BUTTON_LABEL, 'Load interactive demo')
  assert.equal(LIVE_DEMO_FALLBACK_LINK_LABEL, 'Open in new tab')
  assert.equal(getLiveDemoLoadAriaLabel('Lumo'), 'Load Lumo demo')
})

test('live demo motion helpers preserve default sizing and panel states', () => {
  assert.equal(LIVE_DEMO_DEFAULT_ASPECT_RATIO, '16/9')
  assert.equal(LIVE_DEMO_PANEL_DURATION_MS, 600)
  assert.deepEqual(getLiveDemoPanelAnimationState(true), LIVE_DEMO_PANEL_ENTER_STATE)
  assert.deepEqual(getLiveDemoPanelAnimationState(false), LIVE_DEMO_PANEL_EXIT_STATE)
})
