import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import postcss from 'postcss'
import tailwindcss from 'tailwindcss'
import loadConfig from 'tailwindcss/loadConfig.js'

const read = (path) => readFileSync(new URL(`../${path}`, import.meta.url), 'utf8')
const background = read('src/app/dark-theme.css').match(/--background:\s*(#[\da-f]+);/)[1]

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

test('manifest and initial page chrome agree with the dark site canvas', () => {
  const manifest = JSON.parse(read('public/manifest.json'))
  assert.equal(manifest.background_color, background)
  assert.equal(manifest.theme_color, background)
  const layout = read('src/app/layout.tsx')
  assert.ok(read('src/lib/site.ts').includes(`themeColorDark: '${background}'`))
  assert.match(layout, /name="color-scheme" content="dark"/)
  assert.match(layout, /name="apple-mobile-web-app-status-bar-style" content="black"/)
  assert.ok(layout.includes(`html:root{color-scheme:dark;background-color:\${siteConfig.themeColorDark}}`))
  assert.match(layout, /body\{margin:0;background-color:var\(--background,\$\{siteConfig\.themeColorDark\}\)/)
  assert.doesNotMatch(layout, /body\{[^}]*background:/)
})

function assertDarkOffline(html) {
  assert.ok(html.includes(background), 'offline canvas must match the live dark background')
  assert.match(html, /color-scheme:\s*dark[;}]/)
  assert.match(html, /name="theme-color" content="#17191b"/)
  assert.doesNotMatch(html, /prefers-color-scheme|color-scheme:\s*light|#f2f1ef/)
}

test('offline document remains dark regardless of the OS color preference', () => {
  assertDarkOffline(read('public/offline.html'))
})

test('service worker advances the cache and keeps dark offline fallbacks', () => {
  const worker = read('public/sw.js')
  const cacheName = worker.match(/CACHE_NAME = '([^']+)'/)?.[1]
  assert.ok(cacheName, 'service worker must declare a cache name')
  assert.notEqual(cacheName, 'portfolio-assets-v14')
  assert.match(worker, /STATIC_ASSETS = \[[^\]]*\/offline\.html/s)
  assert.match(worker, /cacheNames\s*\n?\s*\.filter\(cacheName => cacheName !== CACHE_NAME\)/)
  assert.match(worker, /caches\.delete\(cacheName\)/)
  assert.match(worker, /self\.skipWaiting\(\)/)
  assert.match(worker, /self\.clients\.claim\(\)/)

  const fallback = worker.match(/new Response\('([^']+)'/)?.[1]
  assert.ok(fallback, 'service worker must include an emergency HTML fallback')
  assertDarkOffline(fallback.replaceAll('\\', ''))
})
