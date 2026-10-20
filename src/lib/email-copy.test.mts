import assert from 'node:assert/strict'
import test from 'node:test'

import { siteConfig } from './site.ts'
import {
  EMAIL_COPIED_TOAST,
  EMAIL_COPY_TOAST_MS,
  copyEmailAddress,
  getEmailAddressFromHref,
} from './email-copy.ts'

test('mailto links expose the address used for copy', () => {
  assert.equal(getEmailAddressFromHref(`mailto:${siteConfig.email}`), siteConfig.email)
  assert.equal(getEmailAddressFromHref(`mailto:${siteConfig.email}?subject=Hello`), siteConfig.email)
  assert.equal(getEmailAddressFromHref('https://hunterbastian.com'), null)
  assert.equal(getEmailAddressFromHref('mailto:'), null)
})

test('email copy reports success and falls back when the clipboard rejects', async () => {
  assert.equal(EMAIL_COPIED_TOAST, 'Email copied')
  assert.equal(EMAIL_COPY_TOAST_MS, 1800)

  const copied = await copyEmailAddress(siteConfig.email, async () => {})
  assert.equal(copied, 'copied')

  const fallback = await copyEmailAddress(siteConfig.email, async () => {
    throw new Error('denied')
  })
  assert.equal(fallback, 'mailto')
})
