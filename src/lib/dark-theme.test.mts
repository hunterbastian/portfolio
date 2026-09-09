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

test('mobile navigation uses the shared surface instead of a hardcoded light fill', () => {
 const source = readFileSync('src/lib/top-meta.ts', 'utf8')
 assert.ok(source.includes('bg-card/95'), 'mobile menu should use the theme card token')
 assert.ok(!source.includes('bg-[#fffaf2]/95'), 'remove obsolete light surface')
})
