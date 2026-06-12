import assert from 'node:assert/strict'
import test from 'node:test'

import {
  HOME_HERO_ACTIONS,
  HOME_HERO_ACTION_CLASS_NAME,
  HOME_HERO_ACTION_HAPTIC_STYLE,
  HOME_HERO_ACTION_LABEL_CLASS_NAME,
  HOME_HERO_INLINE_LOCAL_TIME_CLASS_NAME,
  HOME_HERO_LOCAL_TIME_UPDATE_MS,
  HOME_HERO_LOCAL_TIME_ZONE,
  HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS,
  HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS,
  HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS,
  HOME_HERO_TIME_TOGGLE_CLASS_NAME,
  HOME_HERO_TIME_TOGGLE_HAPTIC_STYLE,
  HOME_HERO_TIME_VALUE_CLASS_NAME,
  activateHomeHeroAction,
  formatHomeHeroLocalTime,
  getHomeHeroLocalTimeToggleLabel,
  getHomeHeroIntroParagraphs,
  getHomeHeroProfileDefocusClassName,
  getNextHomeHeroLocalTimeFormat,
} from './home-hero.ts'

test('home hero intro helper preserves paragraph splitting', () => {
  assert.deepEqual(getHomeHeroIntroParagraphs('One paragraph'), ['One paragraph'])
  assert.deepEqual(getHomeHeroIntroParagraphs('First\n\nSecond'), ['First', 'Second'])
  assert.deepEqual(getHomeHeroIntroParagraphs('First\n\n'), ['First', ''])
})

test('home hero action metadata preserves navigation, analytics, and toast contracts', () => {
  assert.equal(
    HOME_HERO_ACTION_CLASS_NAME,
    'text-[0.74rem] text-foreground hover:text-foreground/70 sm:text-[0.78rem]',
  )
  assert.equal(
    HOME_HERO_ACTION_LABEL_CLASS_NAME,
    'underline decoration-transparent underline-offset-[0.2em] group-hover/peek:decoration-current group-focus-visible/peek:decoration-current',
  )
  assert.equal(HOME_HERO_ACTION_HAPTIC_STYLE, 'light')
  assert.equal(HOME_HERO_LOCAL_TIME_ZONE, 'America/Denver')
  assert.equal(HOME_HERO_LOCAL_TIME_UPDATE_MS, 30000)
  assert.match(HOME_HERO_INLINE_LOCAL_TIME_CLASS_NAME, /whitespace-nowrap/)
  assert.match(HOME_HERO_INLINE_LOCAL_TIME_CLASS_NAME, /inline/)
  assert.doesNotMatch(HOME_HERO_INLINE_LOCAL_TIME_CLASS_NAME, /font-mono/)
  assert.match(HOME_HERO_TIME_TOGGLE_CLASS_NAME, /underline/)
  assert.match(HOME_HERO_TIME_TOGGLE_CLASS_NAME, /decoration-dotted/)
  assert.match(HOME_HERO_TIME_TOGGLE_CLASS_NAME, /whitespace-nowrap/)
  assert.match(HOME_HERO_TIME_TOGGLE_CLASS_NAME, /font-\[inherit\]/)
  assert.match(HOME_HERO_TIME_TOGGLE_CLASS_NAME, /text-\[inherit\]/)
  assert.match(HOME_HERO_TIME_TOGGLE_CLASS_NAME, /home-hero-time-toggle/)
  assert.match(HOME_HERO_TIME_TOGGLE_CLASS_NAME, /active:scale-\[0\.96\]/)
  assert.match(HOME_HERO_TIME_VALUE_CLASS_NAME, /home-hero-time-value/)
  assert.match(HOME_HERO_TIME_VALUE_CLASS_NAME, /tabular-nums/)
  assert.equal(HOME_HERO_TIME_TOGGLE_HAPTIC_STYLE, 'light')
  assert.match(HOME_HERO_PROFILE_DEFOCUS_BASE_CLASS, /transition-\[filter,opacity,transform\]/)
  assert.match(HOME_HERO_PROFILE_DEFOCUS_IDLE_CLASS, /blur-0/)
  assert.match(HOME_HERO_PROFILE_DEFOCUS_ACTIVE_CLASS, /blur-\[1\.35px\]/)
  assert.deepEqual(HOME_HERO_ACTIONS, [
    {
      analyticsLabel: 'contact',
      href: '/#contact',
      label: 'Contact',
      peek: 'Say hi',
      toast: 'Say hi',
    },
    {
      analyticsLabel: 'resume',
      href: '/cv',
      label: 'Resume',
      peek: 'Open resume',
      toast: 'Opening resume',
    },
  ])
})

test('formatHomeHeroLocalTime formats Hunter local time in Mountain time', () => {
  assert.equal(formatHomeHeroLocalTime(new Date('2026-06-04T14:34:00.000Z')), '8:34 am')
  assert.equal(formatHomeHeroLocalTime(new Date('2026-06-04T14:34:00.000Z'), 'military'), '08:34')
  assert.equal(formatHomeHeroLocalTime(new Date('2026-06-05T02:34:00.000Z'), 'military'), '20:34')
})

test('home hero local time toggle helpers describe the next format', () => {
  assert.equal(getNextHomeHeroLocalTimeFormat('standard'), 'military')
  assert.equal(getNextHomeHeroLocalTimeFormat('military'), 'standard')
  assert.equal(
    getHomeHeroLocalTimeToggleLabel('standard', '8:34 am'),
    'Switch to 24-hour time. Current time is 8:34 am.',
  )
  assert.equal(
    getHomeHeroLocalTimeToggleLabel('military', '08:34'),
    'Switch to am/pm time. Current time is 08:34.',
  )
})

test('home hero profile defocus helper toggles the blur treatment', () => {
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
  const resumeAction = HOME_HERO_ACTIONS[1]
  const calls: unknown[] = []

  assert.ok(resumeAction)

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
