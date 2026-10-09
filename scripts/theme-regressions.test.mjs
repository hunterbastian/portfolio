import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import loadConfig from 'tailwindcss/loadConfig.js'

const darkThemeSource = readFileSync('src/app/dark-theme.css', 'utf8')
const layoutSource = readFileSync('src/app/layout.tsx', 'utf8')
const siteSource = readFileSync('src/lib/site.ts', 'utf8')
const manifestSource = readFileSync('public/manifest.json', 'utf8')
const offlineSource = readFileSync('public/offline.html', 'utf8')
const workerSource = readFileSync('public/sw.js', 'utf8')
const background = darkThemeSource.match(/--background:\s*(#[\da-f]+);/)[1]

test('Tailwind emits alpha-aware text, surface, border, ring, and arbitrary utilities', async () => {
  const config = loadConfig(new URL('../tailwind.config.ts', import.meta.url).pathname)
  const cases = [
    ['text-muted-foreground/62', 'color', '--muted-foreground', '0.62'],
    ['text-muted-foreground/68', 'color', '--muted-foreground', '0.68'],
    ['text-muted-foreground/78', 'color', '--muted-foreground', '0.78'],
    ['text-foreground/72', 'color', '--foreground', '0.72'],
    ['text-foreground/74', 'color', '--foreground', '0.74'],
    ['text-foreground/76', 'color', '--foreground', '0.76'],
    ['text-foreground/94', 'color', '--foreground', '0.94'],
    ['bg-card/92', 'background-color', '--card', '0.92'],
    ['bg-card/95', 'background-color', '--card', '0.95'],
    ['bg-background/82', 'background-color', '--background', '0.82'],
    ['border-border/85', 'border-color', '--border', '0.85'],
    ['ring-accent/50', '--tw-ring-color', '--accent', '0.5'],
    ['text-foreground/[0.37]', 'color', '--foreground', '0.37'],
  ]
  const result = await postcss([tailwindcss({
    ...config,
    plugins: [],
    content: [{ raw: `${cases.map(([name]) => name).join(' ')} text-foreground`, extension: 'html' }],
  })]).process('@tailwind utilities;', { from: undefined })

  for (const [name, property, token, opacity] of cases) {
    let value
    const selector = `.${name.replaceAll(/([/.[\]])/g, '\\$1')}`
    result.root.walkRules(selector, (rule) => {
      value = rule.nodes.find((node) => node.prop === property)?.value
    })
    assert.ok(value, `${name} must generate a ${property} declaration`)
    assert.ok(value.includes(`var(${token})`), `${name} must retain the existing color token`)
    assert.match(value, /color-mix\(in srgb,/)
    assert.ok(value.includes(`${opacity} * 100%`), `${name} must apply its alpha`)
  }
})

test('manifest and initial page chrome agree with the paper site canvas', () => {
  const manifest = JSON.parse(manifestSource)
  assert.equal(manifest.background_color, background)
  assert.equal(manifest.theme_color, background)
  assert.ok(siteSource.includes(`themeColorLight: '${background}'`))
  assert.ok(layoutSource.includes('name="color-scheme" content="light"'))
  assert.ok(layoutSource.includes('name="apple-mobile-web-app-status-bar-style" content="default"'))
  assert.ok(layoutSource.includes('html:root{color-scheme:light;background-color:${siteConfig.themeColorLight};scrollbar-gutter:stable}'))
  assert.ok(layoutSource.includes('body{margin:0;background-color:var(--background,${siteConfig.themeColorLight})'))
  assert.equal(layoutSource.includes('body{margin:0;background:'), false)
})

function assertPaperOffline(source) {
  assert.ok(source.includes(background), 'offline canvas must match the live paper background')
  assert.ok(source.includes('color-scheme: light') || source.includes('color-scheme:light'))
  assert.ok(source.includes(`name="theme-color" content="${background}"`))
  assert.equal(source.includes('prefers-color-scheme'), false)
  assert.equal(source.includes('color-scheme: dark'), false)
  assert.equal(source.includes('#f2f1ef'), false)
}

test('offline document remains light regardless of the OS color preference', () => {
  assertPaperOffline(offlineSource)
})

test('playground archive board stays on the paper canvas tokens', () => {
  const playgroundSource = readFileSync('src/app/playground.css', 'utf8')
  const galleryOverride = '.playground-gallery-shell {\n  background: var(--card);\n  box-shadow: var(--shadow-raised);\n}'

  assert.ok(playgroundSource.includes('linear-gradient(180deg, rgba(255, 255, 255, 0.96)'))
  assert.ok(darkThemeSource.includes(galleryOverride))
  assert.ok(darkThemeSource.includes('--foreground: #342e27'))
})

test('service worker advances the cache and keeps paper offline fallbacks', () => {
  const cacheName = workerSource.match(/CACHE_NAME = '([^']+)'/)?.[1]
  assert.ok(cacheName, 'service worker must declare a cache name')
  assert.notEqual(cacheName, 'portfolio-assets-v14')
  assert.ok(workerSource.includes("'/offline.html'"))
  assert.ok(workerSource.includes('cacheName !== CACHE_NAME'))
  assert.ok(workerSource.includes('caches.delete(cacheName)'))
  assert.ok(workerSource.includes('self.skipWaiting()'))
  assert.ok(workerSource.includes('self.clients.claim()'))

  const fallback = workerSource.match(/new Response\('([^']+)'/)?.[1]
  assert.ok(fallback, 'service worker must include an emergency HTML fallback')
  assertPaperOffline(fallback)
})
