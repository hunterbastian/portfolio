import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  HOME_HERO_ACTIONS,
  HOME_HERO_ACTION_HAPTIC_STYLE,
  HOME_HERO_LOCAL_TIME_CLASS_NAME,
  HOME_HERO_LOCAL_TIME_SEPARATOR_CLASS_NAME,
  HOME_HERO_LOCAL_TIME_UPDATE_MS,
  HOME_HERO_LOCAL_TIME_ZONE,
  HOME_HERO_INTRO_CLASS_NAME,
  HOME_HERO_LOCATION_LABEL_CLASS_NAME,
  HOME_HERO_LOCATION_META_CLASS_NAME,
  HOME_HERO_NAME_CLASS_NAME,
  HOME_HERO_PRIMARY_ACTION_CLASS_NAME,
  HOME_HERO_PRIMARY_ACTION_LABEL_CLASS_NAME,
  HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS,
  HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS,
  HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS,
  HOME_HERO_SECONDARY_ACTION_CLASS_NAME,
  HOME_HERO_SECONDARY_ACTION_LABEL_CLASS_NAME,
  activateHomeHeroAction,
  formatHomeHeroLocalTime,
  getHomeHeroActionClassName,
  getHomeHeroActionLabelClassName,
  getHomeHeroIntroParagraphs,
  getHomeHeroLocalTimeAriaLabel,
  getHomeHeroLocalTimeDelayMs,
  getHomeHeroProfileDefocusClassName,
} from './home-hero.ts'

test('home hero intro helper preserves paragraph splitting', () => {
  assert.deepEqual(getHomeHeroIntroParagraphs('One paragraph'), ['One paragraph'])
  assert.deepEqual(getHomeHeroIntroParagraphs('First\n\nSecond'), ['First', 'Second'])
  assert.deepEqual(getHomeHeroIntroParagraphs('First\n\n'), ['First', ''])
})

test('home hero keeps the design sentence and UVU line without a prose clock', () => {
  const homepage = readFileSync(new URL('../content/homepage.ts', import.meta.url), 'utf8')
  const hero = readFileSync(new URL('../components/home/HomeHeroSection.tsx', import.meta.url), 'utf8')

  assert.match(homepage, /calm interfaces, thoughtful motion, and visual restraint/)
  assert.match(homepage, /Utah Valley University/)
  assert.doesNotMatch(homepage, /Local time is/)
  assert.doesNotMatch(hero, /Local time is/)
  assert.doesNotMatch(hero, /<button/)
  assert.match(hero, /HOME_HERO_NAME_CLASS_NAME/)
  assert.match(hero, /HOME_HERO_INTRO_CLASS_NAME/)
  assert.match(hero, /HOME_HERO_LOCATION_META_CLASS_NAME/)
  assert.match(hero, /formatHomeHeroLocalTime/)
  assert.doesNotMatch(hero, /text-\[30px\]/)
  assert.doesNotMatch(hero, /sm:text-\[36px\]/)
  assert.match(hero, /aria-live="off"/)
  assert.match(
    hero,
    /homeHeroContent\.subtitle[\s\S]*getHomeHeroLocalTimeAriaLabel[\s\S]*introParagraphs\.map/,
  )
})

test('home hero local time stays a quiet 24-hour Mountain Time meta line', () => {
  assert.equal(HOME_HERO_LOCAL_TIME_ZONE, 'America/Denver')
  assert.equal(HOME_HERO_LOCAL_TIME_UPDATE_MS, 60_000)
  assert.equal(formatHomeHeroLocalTime(new Date('2026-06-04T14:34:00.000Z')), '08:34')
  assert.equal(formatHomeHeroLocalTime(new Date('2026-06-05T02:34:00.000Z')), '20:34')
  assert.equal(formatHomeHeroLocalTime(new Date('2026-01-01T07:05:00.000Z')), '00:05')
  assert.equal(getHomeHeroLocalTimeAriaLabel('08:34'), '08:34 in Lehi')
  assert.equal(getHomeHeroLocalTimeDelayMs(new Date(60_000)), 60_000)
  assert.equal(getHomeHeroLocalTimeDelayMs(new Date(60_001)), 59_999)
  assert.match(HOME_HERO_LOCATION_META_CLASS_NAME, /whitespace-nowrap/)
  assert.match(HOME_HERO_LOCATION_META_CLASS_NAME, /font-mono/)
  assert.match(HOME_HERO_LOCATION_META_CLASS_NAME, /text-\[10px\]/)
  assert.match(HOME_HERO_LOCATION_META_CLASS_NAME, /font-normal/)
  assert.match(HOME_HERO_LOCATION_META_CLASS_NAME, /text-subtle-foreground/)
  assert.doesNotMatch(HOME_HERO_LOCATION_META_CLASS_NAME, /text-\[0\.76rem\]/)
  assert.match(HOME_HERO_LOCATION_LABEL_CLASS_NAME, /uppercase/)
  assert.match(HOME_HERO_LOCATION_LABEL_CLASS_NAME, /tracking-\[0\.18em\]/)
  assert.match(HOME_HERO_LOCAL_TIME_SEPARATOR_CLASS_NAME, /text-subtle-foreground/)
  assert.match(HOME_HERO_LOCAL_TIME_CLASS_NAME, /tabular-nums/)
  assert.match(HOME_HERO_LOCAL_TIME_CLASS_NAME, /text-subtle-foreground/)
  assert.doesNotMatch(HOME_HERO_LOCAL_TIME_CLASS_NAME, /underline|accent|uppercase/)
})

test('home hero name is one step larger with Swiss display tracking and the only 600 weight', () => {
  assert.match(HOME_HERO_NAME_CLASS_NAME, /text-\[36px\]/)
  assert.match(HOME_HERO_NAME_CLASS_NAME, /sm:text-\[44px\]/)
  assert.match(HOME_HERO_NAME_CLASS_NAME, /font-semibold/)
  assert.match(HOME_HERO_NAME_CLASS_NAME, /tracking-\[-0\.035em\]/)
  assert.doesNotMatch(HOME_HERO_NAME_CLASS_NAME, /font-normal|text-\[30px\]/)
  assert.match(HOME_HERO_INTRO_CLASS_NAME, /font-normal/)
  assert.match(HOME_HERO_INTRO_CLASS_NAME, /leading-\[1\.5\]/)
  assert.match(HOME_HERO_INTRO_CLASS_NAME, /text-foreground/)
  assert.match(HOME_HERO_PRIMARY_ACTION_CLASS_NAME, /font-medium/)
  assert.match(HOME_HERO_SECONDARY_ACTION_CLASS_NAME, /font-medium/)
})

test('home hero actions put Resume first as the primary CTA', () => {
  assert.deepEqual(
    HOME_HERO_ACTIONS.map((action) => ({
      analyticsLabel: action.analyticsLabel,
      href: action.href,
      label: action.label,
      variant: action.variant,
    })),
    [
      {
        analyticsLabel: 'resume',
        href: '/cv',
        label: 'Resume',
        variant: 'primary',
      },
      {
        analyticsLabel: 'contact',
        href: '/#contact',
        label: 'Contact',
        variant: 'secondary',
      },
    ],
  )
  assert.equal(HOME_HERO_ACTIONS.length, 2)
  assert.match(HOME_HERO_PRIMARY_ACTION_CLASS_NAME, /text-foreground/)
  assert.match(HOME_HERO_SECONDARY_ACTION_CLASS_NAME, /text-muted-foreground/)
  assert.match(HOME_HERO_PRIMARY_ACTION_LABEL_CLASS_NAME, /decoration-current\/40/)
  assert.match(HOME_HERO_SECONDARY_ACTION_LABEL_CLASS_NAME, /decoration-transparent/)
  assert.equal(getHomeHeroActionClassName('primary'), HOME_HERO_PRIMARY_ACTION_CLASS_NAME)
  assert.equal(getHomeHeroActionClassName('secondary'), HOME_HERO_SECONDARY_ACTION_CLASS_NAME)
  assert.equal(getHomeHeroActionLabelClassName('primary'), HOME_HERO_PRIMARY_ACTION_LABEL_CLASS_NAME)
  assert.equal(getHomeHeroActionLabelClassName('secondary'), HOME_HERO_SECONDARY_ACTION_LABEL_CLASS_NAME)
  assert.equal(HOME_HERO_ACTION_HAPTIC_STYLE, 'light')
})

test('home hero profile defocus helper toggles the blur treatment', () => {
  assert.match(HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS, /transition-\[filter,opacity,transform\]/)
  assert.match(HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS, /blur-0/)
  assert.match(HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS, /blur-\[1\.35px\]/)
  assert.equal(
    getHomeHeroProfileDefocusClassName(false),
    `${HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS} ${HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS}`,
  )
  assert.equal(
    getHomeHeroProfileDefocusClassName(true),
    `${HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS} ${HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS}`,
  )
})

test('activateHomeHeroAction preserves haptic, analytics, and toast ordering', () => {
  const resumeAction = HOME_HERO_ACTIONS[0]
  const calls: unknown[] = []

  assert.ok(resumeAction)
  assert.equal(resumeAction.analyticsLabel, 'resume')

  activateHomeHeroAction({
    action: resumeAction,
    showToast: (message) => calls.push(['toast', message]),
    trackNavigationClick: (target) => calls.push(['navigation', target]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'light'],
    ['navigation', 'resume'],
    ['toast', 'Opening resume'],
  ])
})
