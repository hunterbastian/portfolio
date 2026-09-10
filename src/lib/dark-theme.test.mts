import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('portfolio serves dark styling on first render without client theme hydration', () => {
 const layout = readFileSync('src/app/layout.tsx', 'utf8')
 assert.match(layout, /import '\.\/dark-theme.css'/)
 assert.match(layout, /siteConfig.themeColorDark/)
 assert.match(layout, /name="color-scheme" content="dark"/)
 assert.match(layout, /name="apple-mobile-web-app-status-bar-style" content="black"/)
 const css = readFileSync('src/app/dark-theme.css', 'utf8')
 assert.match(css, /color-scheme: dark/)
 assert.match(css, /--background: #242933/)
 const site = readFileSync('src/lib/site.ts', 'utf8')
 assert.match(site, /themeColorDark: '#242933'/)
})

test('dark surfaces climb the Nord polar night ramp', () => {
 const css = readFileSync('src/app/dark-theme.css', 'utf8')
 const token = (name) => css.match(new RegExp(`--${name}: (#[0-9a-f]{6})`))?.[1]

 assert.equal(token('card'), '#2e3440')
 assert.equal(token('secondary'), '#3b4252')
 assert.equal(token('border'), '#434c5e')
 assert.equal(token('foreground'), '#eceff4')
 assert.equal(token('ring'), '#88c0d0')
 assert.equal(token('accent-blue'), '#81a1c1')
})

test('the ambient backdrop is graded onto Nord rather than its own photographic hues', () => {
 const theme = readFileSync('src/app/dark-theme.css', 'utf8')
 assert.match(theme, /--ambient-grade: #5e81ac/)

 const hero = readFileSync('src/components/home/HomeHeroSection.tsx', 'utf8')
 assert.match(hero, /grayscale/, 'the alpine poster must be flattened before it is tinted')
 assert.match(hero, /bg-\[var\(--ambient-grade\)\] mix-blend-color/)

 const globals = readFileSync('src/app/globals.css', 'utf8')
 const washes = globals.slice(
  globals.indexOf('.home-painterly-washes {'),
  globals.indexOf('.home-coast-outro'),
 )
 assert.ok(washes.length > 0, 'expected to find the painterly wash block')
 assert.match(washes, /background-blend-mode: screen, color, normal/, 'the dune needs the grade layer')

 // Mask stops are the only place raw rgb() is legitimate here; every colour is a token.
 const literalColours = washes
  .split('\n')
  .filter((line) => /rgba?\(\s*\d/.test(line) && !/mask-image/.test(line))
 assert.deepEqual(literalColours, [], 'ambient washes must reference --ambient-* tokens')
})

test('mobile navigation uses the shared surface instead of a hardcoded light fill', () => {
 const source = readFileSync('src/lib/top-meta.ts', 'utf8')
 assert.ok(source.includes('bg-card/95'), 'mobile menu should use the theme card token')
 assert.ok(!source.includes('bg-[#fffaf2]/95'), 'remove obsolete light surface')
})
