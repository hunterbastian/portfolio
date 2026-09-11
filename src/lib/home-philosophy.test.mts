import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  HOME_PHILOSOPHY_BODY_CLASS_NAME,
  HOME_PHILOSOPHY_TITLE,
  HOME_PHILOSOPHY_TITLE_CLASS_NAME,
  getHomePhilosophySentences,
  isHomePhilosophyBrief,
} from './home-philosophy.ts'

const philosophyBody =
  'I start with the quietest version that still feels complete. Motion is there to orient, not decorate. If a detail does not help someone move through a product more calmly, I leave it out.'

test('homepage philosophy beat stays short and in Hunter’s voice', () => {
  const homepage = readFileSync(new URL('../content/homepage.ts', import.meta.url), 'utf8')

  assert.equal(HOME_PHILOSOPHY_TITLE, 'How I build')
  assert.equal(isHomePhilosophyBrief(philosophyBody), true)
  assert.deepEqual(getHomePhilosophySentences(philosophyBody), [
    'I start with the quietest version that still feels complete.',
    'Motion is there to orient, not decorate.',
    'If a detail does not help someone move through a product more calmly, I leave it out.',
  ])
  assert.match(homepage, /title: 'How I build'/)
  assert.match(homepage, /quietest version that still feels complete/)
  assert.match(homepage, /Motion is there to orient, not decorate/)
  assert.doesNotMatch(homepage, /Lorem ipsum/)
})

test('philosophy sits after the hero and before projects without a new nav item', () => {
  const page = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
  const nav = readFileSync(new URL('./home-section-nav.ts', import.meta.url), 'utf8')
  const philosophy = readFileSync(new URL('../components/home/HomePhilosophySection.tsx', import.meta.url), 'utf8')

  assert.ok(page.indexOf('<HomeHeroSection') < page.indexOf('<HomePhilosophySection'))
  assert.ok(page.indexOf('<HomePhilosophySection') < page.indexOf('<HomeProjectsSection'))
  assert.doesNotMatch(nav, /philosophy/)
  assert.doesNotMatch(nav, /How I build/)
  assert.match(HOME_PHILOSOPHY_TITLE_CLASS_NAME, /text-\[10px\]/)
  assert.match(HOME_PHILOSOPHY_TITLE_CLASS_NAME, /sm:text-\[11px\]/)
  assert.match(HOME_PHILOSOPHY_TITLE_CLASS_NAME, /tracking-\[0\.18em\]/)
  assert.match(HOME_PHILOSOPHY_TITLE_CLASS_NAME, /text-subtle-foreground/)
  assert.match(HOME_PHILOSOPHY_BODY_CLASS_NAME, /font-normal/)
  assert.match(HOME_PHILOSOPHY_BODY_CLASS_NAME, /leading-\[1\.5\]/)
  assert.match(HOME_PHILOSOPHY_BODY_CLASS_NAME, /text-foreground/)
  assert.match(philosophy, /HOME_PHILOSOPHY_TITLE_CLASS_NAME/)
  assert.match(philosophy, /HOME_PHILOSOPHY_BODY_CLASS_NAME/)
})
