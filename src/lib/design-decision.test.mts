import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DESIGN_DECISION_DESCRIPTION_DURATION_MS,
  DESIGN_DECISION_DESCRIPTION_EXIT_STATE,
  DESIGN_DECISION_DESCRIPTION_INITIAL_STATE,
  DESIGN_DECISION_DESCRIPTION_VISIBLE_STATE,
  DESIGN_DECISION_OPTION_BUTTON_ACTIVE_CLASS,
  DESIGN_DECISION_OPTION_BUTTON_BASE_CLASS,
  DESIGN_DECISION_OPTION_BUTTON_INACTIVE_CLASS,
  DESIGN_DECISION_PANEL_DURATION_MS,
  DESIGN_DECISION_PANEL_INITIAL_STATE,
  DESIGN_DECISION_PANEL_VISIBLE_STATE,
  getDesignDecisionOptionButtonClassName,
  getDesignDecisionPanelAnimationState,
  parseDesignDecisionOptions,
  shouldShowDesignDecisionChosenIndicator,
} from './design-decision.ts'

test('design decision constants preserve motion and option styles', () => {
  assert.equal(DESIGN_DECISION_PANEL_DURATION_MS, 500)
  assert.equal(DESIGN_DECISION_DESCRIPTION_DURATION_MS, 250)
  assert.deepEqual(DESIGN_DECISION_PANEL_INITIAL_STATE, { opacity: 0, y: 12 })
  assert.deepEqual(DESIGN_DECISION_PANEL_VISIBLE_STATE, { opacity: 1, y: 0 })
  assert.deepEqual(DESIGN_DECISION_DESCRIPTION_INITIAL_STATE, { opacity: 0, y: 4 })
  assert.deepEqual(DESIGN_DECISION_DESCRIPTION_VISIBLE_STATE, { opacity: 1, y: 0 })
  assert.deepEqual(DESIGN_DECISION_DESCRIPTION_EXIT_STATE, { opacity: 0, y: -4 })
})

test('parseDesignDecisionOptions supports arrays, MDX JSON strings, and invalid input', () => {
  const options = [
    { label: 'Quiet', description: 'Keep the surface calm.' },
    { label: 'Expressive', description: 'Make the choice more visible.' },
  ]

  assert.deepEqual(parseDesignDecisionOptions(options), options)
  assert.deepEqual(parseDesignDecisionOptions(JSON.stringify(options)), options)
  assert.deepEqual(parseDesignDecisionOptions('not json'), [])
})

test('design decision render helpers preserve state-dependent display decisions', () => {
  assert.deepEqual(getDesignDecisionPanelAnimationState(false), DESIGN_DECISION_PANEL_INITIAL_STATE)
  assert.deepEqual(getDesignDecisionPanelAnimationState(true), DESIGN_DECISION_PANEL_VISIBLE_STATE)
  assert.equal(
    getDesignDecisionOptionButtonClassName(true),
    `${DESIGN_DECISION_OPTION_BUTTON_BASE_CLASS} ${DESIGN_DECISION_OPTION_BUTTON_ACTIVE_CLASS}`,
  )
  assert.equal(
    getDesignDecisionOptionButtonClassName(false),
    `${DESIGN_DECISION_OPTION_BUTTON_BASE_CLASS} ${DESIGN_DECISION_OPTION_BUTTON_INACTIVE_CLASS}`,
  )
  assert.equal(shouldShowDesignDecisionChosenIndicator(1, 1), true)
  assert.equal(shouldShowDesignDecisionChosenIndicator(0, 1), false)
})
