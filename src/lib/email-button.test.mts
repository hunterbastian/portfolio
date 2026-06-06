import assert from 'node:assert/strict'
import test from 'node:test'

import {
  DEFAULT_EMAIL_BUTTON_LABEL,
  getEmailButtonAriaLabel,
  getEmailButtonHref,
  getEmailButtonViewState,
} from './email-button.ts'

test('email button helpers preserve mailto hrefs and default copy', () => {
  assert.equal(DEFAULT_EMAIL_BUTTON_LABEL, 'email me')
  assert.equal(getEmailButtonHref('hunter@example.com'), 'mailto:hunter@example.com')
  assert.equal(getEmailButtonAriaLabel('hunter@example.com'), 'Email me directly at hunter@example.com')
})

test('email button view state resolves defaults and accessible labels', () => {
  assert.deepEqual(getEmailButtonViewState({ email: 'hunter@example.com' }), {
    ariaLabel: 'Email me directly at hunter@example.com',
    href: 'mailto:hunter@example.com',
    label: 'email me',
  })
  assert.deepEqual(
    getEmailButtonViewState({
      ariaLabel: 'Send a note',
      email: 'hunter@example.com',
      label: 'contact',
    }),
    {
      ariaLabel: 'Send a note',
      href: 'mailto:hunter@example.com',
      label: 'contact',
    },
  )
})
