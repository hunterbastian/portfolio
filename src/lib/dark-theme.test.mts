import { test } from 'node:test'
import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'

test('portfolio serves dark styling on first render without client theme hydration', () => {
 const layout = readFileSync('src/app/layout.tsx', 'utf8')
 assert.match(layout, /import '\.\/dark-theme.css'/)
 assert.match(layout, /siteConfig.themeColorDark/)
 assert.match(layout, /name="color-scheme" content="dark"/)
 assert.match(layout, /name="apple-mobile-web-app-status-bar-style" content="black"/)
 assert.doesNotMatch(layout, /35,\s*131,\s*226|#2383E2/i)
 const css = readFileSync('src/app/dark-theme.css', 'utf8')
 assert.match(css, /color-scheme: dark/)
 assert.match(css, /--background: #26231e/)
 assert.match(css, /--card: #2e2a24/)
 assert.match(css, /--secondary: #3b352c/)
 assert.match(css, /--border: #4d463b/)
 assert.match(css, /--foreground: #f2ebdd/)
 assert.match(css, /--muted-foreground: #c4baab/)
 assert.match(css, /line-height: 1\.5/)
 assert.doesNotMatch(css, /#2383E2/i)
 const site = readFileSync('src/lib/site.ts', 'utf8')
 assert.match(site, /themeColorDark: '#26231e'/)
})

test('dark chrome pills retain their highlight and tokenized email accent', () => {
 const css = readFileSync('src/app/dark-theme.css', 'utf8')
 assert.match(css, /\.chrome-pill::before,\s*\.chrome-pill::after \{\s*opacity: 1;\s*\}/)
 assert.match(css, /--contact-email-accent-soft/)
 assert.match(css, /--contact-email-accent/)
 assert.match(css, /\.chrome-scroll-top::before/)
})

test('mobile navigation uses the shared elevated surface instead of a hardcoded light fill', () => {
 const source = readFileSync('src/lib/top-meta.ts', 'utf8')
 assert.ok(source.includes('bg-[#252525]'), 'mobile menu should use the elevated dark surface')
 assert.ok(!source.includes('bg-[#fffaf2]/95'), 'remove obsolete light surface')
})

test('dark focus ring stays visible without a green or Notion-blue accent', () => {
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

 assert.match(dialog, /bg-\[#252525\]/)
 assert.match(dialog, /border-\[#373737\]/)
 assert.match(header, /text-\[0\.875rem\]/)
 assert.match(header, /bg-\[#202020\]/)
 assert.match(list, /hover:bg-\[#2f2f2f\]/)
 assert.doesNotMatch(`${dialog}\n${header}\n${list}`, /#2383E2|contact-email-accent/i)
})

test('selection and custom focus rings stay neutral in dark mode', () => {
 const globals = readFileSync('src/app/globals.css', 'utf8')
 const arcButton = readFileSync('src/components/ArcGlossUploadButton.module.css', 'utf8')

 assert.match(globals, /::selection \{\s*background: color-mix\(in srgb, var\(--foreground\) 20%, transparent\);/)
 assert.match(arcButton, /\.button:focus-visible \{\s*outline: 2px solid var\(--ring\);/)
 assert.doesNotMatch(arcButton, /102,\s*126,\s*172|#2383E2/i)
})
