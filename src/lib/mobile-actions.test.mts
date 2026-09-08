import { test } from 'node:test'
import assert from 'node:assert/strict'
import { HOME_HERO_ACTION_CLASS_NAME } from './home-hero.ts'

test('hero actions provide a 44px mobile tap target while preserving desktop sizing', () => {
 assert.ok(HOME_HERO_ACTION_CLASS_NAME.includes('min-h-[44px]'))
 assert.ok(HOME_HERO_ACTION_CLASS_NAME.includes('sm:min-h-0'))
})
