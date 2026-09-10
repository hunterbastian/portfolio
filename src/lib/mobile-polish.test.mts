import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import {
  HOME_HERO_PRIMARY_ACTION_CLASS_NAME,
  HOME_HERO_SECONDARY_ACTION_CLASS_NAME,
} from './home-hero.ts'
import { getTopMetaMobileMenuClassName, getTopMetaShellClassName } from './top-meta.ts'

test('sticky homepage header stays compact on mobile and respects the notch', () => {
  const shell = getTopMetaShellClassName(false, false, true)
  const menu = getTopMetaMobileMenuClassName(false)

  assert.match(shell, /py-2\.5/)
  assert.match(shell, /pt-\[max\(0\.625rem,env\(safe-area-inset-top\)\)\]/)
  assert.match(shell, /backdrop-blur-md/)
  assert.match(menu, /safe-area-inset-right/)
  assert.match(menu, /safe-area-inset-top/)
  assert.match(menu, /min\(14rem/)
})

test('homepage mobile chrome keeps 44px tap targets on primary actions', () => {
  const tactile = readFileSync(new URL('../components/ui/tactile.ts', import.meta.url), 'utf8')

  assert.match(HOME_HERO_PRIMARY_ACTION_CLASS_NAME, /min-h-\[44px\]/)
  assert.match(HOME_HERO_SECONDARY_ACTION_CLASS_NAME, /min-h-\[44px\]/)
  assert.match(tactile, /'contact-primary': 'min-h-\[44px\]/)
  assert.match(tactile, /'contact-social': 'min-h-\[44px\] min-w-\[6\.25rem\]/)
  assert.doesNotMatch(tactile, /'contact-social': 'min-h-\[44px\] w-\[5\.85rem\]/)
})

test('mobile project collage stays clipped and does not steal taps from named rows', () => {
  const stack = readFileSync(new URL('../components/home/WorkScatterStack.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../components/home/WorkScatterStack.module.css', import.meta.url), 'utf8')
  const projects = readFileSync(new URL('../components/home/HomeProjectsSection.tsx', import.meta.url), 'utf8')
  const rows = readFileSync(new URL('../components/home/FeaturedProjectList.tsx', import.meta.url), 'utf8')

  assert.match(projects, /decorative/)
  assert.match(stack, /styles\.decorative/)
  assert.match(css, /\.decorative \{\s*pointer-events: none;/)
  assert.match(css, /overflow: hidden;/)
  assert.match(css, /min-height: 13\.25rem;/)
  assert.match(rows, /min-h-\[44px\]/)
  assert.match(rows, /break-words/)
})

test('contact and scroll-to-top keep comfortable mobile padding and safe areas', () => {
  const contact = readFileSync(new URL('../components/home/ContactLinks.tsx', import.meta.url), 'utf8')
  const scroll = readFileSync(new URL('../components/ScrollToTop.tsx', import.meta.url), 'utf8')
  const page = readFileSync(new URL('../components/AnimatedHomePage.tsx', import.meta.url), 'utf8')
  const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')

  assert.match(contact, /max-w-full/)
  assert.match(contact, /space-y-6/)
  assert.match(scroll, /safe-area-inset-bottom/)
  assert.match(scroll, /safe-area-inset-right/)
  assert.match(page, /pt-\[4\.75rem\]/)
  assert.match(layout, /safe-area-padding/)
})
