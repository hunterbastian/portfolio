import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { CHROME_NAV_ACTIVE_CLASS, CHROME_NAV_INACTIVE_CLASS } from './chrome.ts'

const CHROME_FILES = [
  'src/lib/chrome.ts',
  'src/lib/top-meta.ts',
  'src/lib/home-section-nav.ts',
  'src/lib/home-projects.ts',
  'src/lib/home-endeavors.ts',
  'src/components/home/FeaturedProjectList.tsx',
  'src/components/home/HomeEndeavorsSection.tsx',
  'src/components/home/HomeProjectsSection.tsx',
  'src/components/home/HomeSection.tsx',
]

test('chrome nav highlight stays a soft grey elevated pill', () => {
  assert.match(CHROME_NAV_ACTIVE_CLASS, /text-foreground/)
  assert.match(CHROME_NAV_ACTIVE_CLASS, /bg-secondary/)
  assert.doesNotMatch(CHROME_NAV_ACTIVE_CLASS, /#2f7d73|#2383E2|accent/)
  assert.match(CHROME_NAV_INACTIVE_CLASS, /hover:text-foreground/)
  assert.match(CHROME_NAV_INACTIVE_CLASS, /hover:bg-secondary/)
  assert.doesNotMatch(CHROME_NAV_INACTIVE_CLASS, /#2f7d73|#2383E2|accent/)
})

test('homepage chrome sources do not use teal interactive accents', () => {
  for (const file of CHROME_FILES) {
    const source = readFileSync(file, 'utf8')
    assert.doesNotMatch(source, /#2f7d73/, `${file} still contains #2f7d73`)
  }
})

test('document root reserves a stable scrollbar gutter without hiding scrollbars', () => {
  const css = readFileSync(new URL('../app/globals.css', import.meta.url), 'utf8')
  const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')
  const htmlRule = css.match(/html\s*\{[^}]+\}/)?.[0] ?? ''

  assert.match(htmlRule, /scrollbar-gutter:\s*stable/)
  assert.doesNotMatch(htmlRule, /scrollbar-width:\s*none/)
  assert.doesNotMatch(htmlRule, /::-webkit-scrollbar/)
  assert.match(layout, /scrollbar-gutter:stable/)
})
