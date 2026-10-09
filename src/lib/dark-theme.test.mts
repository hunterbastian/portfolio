import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('portfolio serves paper styling on first render without client theme hydration', () => {
 const layout = readFileSync('src/app/layout.tsx', 'utf8')
 assert.match(layout, /import '\.\/dark-theme.css'/)
 assert.match(layout, /siteConfig.themeColorLight/)
 assert.match(layout, /name="color-scheme" content="light"/)
 assert.match(layout, /name="apple-mobile-web-app-status-bar-style" content="default"/)
 assert.doesNotMatch(layout, /35,\s*131,\s*226|#2383E2/i)
 const css = readFileSync('src/app/dark-theme.css', 'utf8')
 assert.match(css, /color-scheme: light/)
 assert.match(css, /--background: #eee8dd/)
 assert.match(css, /--card: #f5f0e7/)
 assert.match(css, /--secondary: #e4dbcf/)
 assert.match(css, /--border: #ccc1b2/)
 assert.match(css, /--foreground: #342e27/)
 assert.match(css, /--muted-foreground: #6e6258/)
 assert.match(css, /line-height: 1\.5/)
 assert.doesNotMatch(css, /#2383E2/i)
 const site = readFileSync('src/lib/site.ts', 'utf8')
 assert.match(site, /themeColorLight: '#eee8dd'/)
})

test('paper chrome pills share tokenized surfaces and email accent', () => {
 const css = readFileSync('src/app/dark-theme.css', 'utf8')
 assert.match(css, /background: var\(--surface-glass-chrome\)/)
 assert.match(css, /--contact-email-accent-soft/)
 assert.match(css, /--contact-email-accent/)
 assert.match(css, /\.chrome-scroll-top::before/)
})

test('mobile navigation uses the shared elevated surface instead of a hardcoded light fill', () => {
 const source = readFileSync('src/lib/top-meta.ts', 'utf8')
 assert.ok(source.includes('bg-card'), 'mobile menu should use the shared card surface')
 assert.ok(!source.includes('bg-[#fffaf2]/95'), 'remove obsolete light surface')
})

test('wine focus ring stays visible without a green or Notion-blue accent', () => {
 const css = readFileSync('src/app/dark-theme.css', 'utf8')
 assert.match(css, /--ring: var\(--accent\)/)
 assert.doesNotMatch(css, /--ring: #b7cec3/)
 assert.doesNotMatch(css, /--ring: #c8ced2/)
 assert.doesNotMatch(css, /#2383E2/i)
})

test('launcher palette keeps elevated monochrome surfaces and compact command rows', () => {
 const dialog = readFileSync('src/components/launcher/LauncherPaletteDialog.tsx', 'utf8')
 const header = readFileSync('src/components/launcher/LauncherSearchHeader.tsx', 'utf8')
 const list = readFileSync('src/components/launcher/LauncherCommandList.tsx', 'utf8')

 assert.match(dialog, /bg-card/)
 assert.match(dialog, /border-border/)
 assert.match(header, /text-\[0\.875rem\]/)
 assert.match(header, /bg-background/)
 assert.match(list, /hover:bg-secondary/)
 assert.doesNotMatch(`${dialog}\n${header}\n${list}`, /#2383E2|contact-email-accent/i)
})

test('selection and custom focus rings stay neutral on paper', () => {
 const globals = readFileSync('src/app/globals.css', 'utf8')
 const arcButton = readFileSync('src/components/ArcGlossUploadButton.module.css', 'utf8')

 assert.match(globals, /::selection \{\s*background: color-mix\(in srgb, var\(--foreground\) 20%, transparent\);/)
 assert.match(arcButton, /\.button:focus-visible \{\s*outline: 2px solid var\(--ring\);/)
 assert.doesNotMatch(arcButton, /102,\s*126,\s*172|#2383E2/i)
})
