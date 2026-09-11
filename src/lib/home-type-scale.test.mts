import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  HOME_HERO_CONTACT_LINE_CLASS_NAME,
  HOME_HERO_INTRO_CLASS_NAME,
  HOME_HERO_NAME_CLASS_NAME,
  HOME_HERO_PRIMARY_ACTION_CLASS_NAME,
} from './home-hero.ts'
import { HOME_PHILOSOPHY_BODY_CLASS_NAME, HOME_PHILOSOPHY_TITLE_CLASS_NAME } from './home-philosophy.ts'
import {
  HOME_FEATURED_ROW_META_CLASS_NAME,
  HOME_FEATURED_ROW_OUTCOME_CLASS_NAME,
  HOME_FEATURED_ROW_TITLE_CLASS_NAME,
} from './home-projects.ts'
import { HOME_SECTION_TITLE_CLASS_NAME } from './home-section.ts'
import { PEEK_ACTION_BASE_CLASS } from './peek-action.ts'

test('homepage type scale keeps a louder Swiss name and whisper section labels', () => {
  const hero = readFileSync(new URL('../components/home/HomeHeroSection.tsx', import.meta.url), 'utf8')
  const philosophy = readFileSync(new URL('../components/home/HomePhilosophySection.tsx', import.meta.url), 'utf8')
  const playground = readFileSync(new URL('../components/home/HomePlaygroundSection.tsx', import.meta.url), 'utf8')

  assert.match(hero, /HOME_HERO_NAME_CLASS_NAME/)
  assert.match(hero, /HOME_HERO_INTRO_CLASS_NAME/)
  assert.match(hero, /HOME_HERO_CONTACT_LINE_CLASS_NAME/)
  assert.match(HOME_HERO_NAME_CLASS_NAME, /text-\[36px\]/)
  assert.match(HOME_HERO_NAME_CLASS_NAME, /sm:text-\[44px\]/)
  assert.match(HOME_HERO_NAME_CLASS_NAME, /font-semibold/)
  assert.match(HOME_HERO_NAME_CLASS_NAME, /tracking-\[-0\.035em\]/)
  assert.doesNotMatch(HOME_HERO_NAME_CLASS_NAME, /text-\[30px\]|font-normal/)

  assert.match(HOME_SECTION_TITLE_CLASS_NAME, /text-\[10px\]/)
  assert.match(HOME_SECTION_TITLE_CLASS_NAME, /sm:text-\[11px\]/)
  assert.match(HOME_SECTION_TITLE_CLASS_NAME, /tracking-\[0\.18em\]/)
  assert.match(HOME_SECTION_TITLE_CLASS_NAME, /text-subtle-foreground/)
  assert.equal(HOME_PHILOSOPHY_TITLE_CLASS_NAME, HOME_SECTION_TITLE_CLASS_NAME)

  assert.match(HOME_HERO_INTRO_CLASS_NAME, /font-normal/)
  assert.match(HOME_HERO_INTRO_CLASS_NAME, /leading-\[1\.5\]/)
  assert.match(HOME_PHILOSOPHY_BODY_CLASS_NAME, /font-normal/)
  assert.match(HOME_PHILOSOPHY_BODY_CLASS_NAME, /leading-\[1\.5\]/)
  assert.match(philosophy, /HOME_PHILOSOPHY_BODY_CLASS_NAME/)

  assert.match(HOME_HERO_PRIMARY_ACTION_CLASS_NAME, /font-medium/)
  assert.match(PEEK_ACTION_BASE_CLASS, /font-medium/)
  assert.match(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /font-medium/)
  assert.match(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /text-\[0\.92rem\]/)
  assert.match(HOME_FEATURED_ROW_TITLE_CLASS_NAME, /sm:text-\[0\.98rem\]/)
  assert.match(HOME_FEATURED_ROW_META_CLASS_NAME, /text-subtle-foreground/)
  assert.match(HOME_FEATURED_ROW_OUTCOME_CLASS_NAME, /text-muted-foreground/)

  assert.match(HOME_HERO_CONTACT_LINE_CLASS_NAME, /font-normal/)
  assert.match(HOME_HERO_CONTACT_LINE_CLASS_NAME, /leading-\[1\.5\]/)
  assert.doesNotMatch(HOME_HERO_CONTACT_LINE_CLASS_NAME, /font-semibold/)
  assert.match(playground, /font-medium/)
})
