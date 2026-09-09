import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import { test } from 'node:test'
import { runInNewContext } from 'node:vm'
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
  assert.ok(layout.includes('html:root{color-scheme:dark;background:${siteConfig.themeColorDark}}'))
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

function workerHarness() {
  const handlers = {}
  const oldCaches = ['portfolio-assets-v14']
  const deleted = []
  const stored = new Map()
  let currentCache
  let claimed = false
  const self = {
    location: { origin: 'https://portfolio.test' },
    addEventListener: (type, handler) => { handlers[type] = handler },
    skipWaiting: async () => {},
    clients: { claim: async () => { claimed = true } },
  }
  runInNewContext(read('public/sw.js'), {
    self,
    Response,
    fetch: async () => { throw new Error('offline') },
    caches: {
      open: async (name) => {
        currentCache = name
        return { addAll: async (urls) => {
          assert.ok(urls.includes('/offline.html'))
          stored.set('/offline.html', read('public/offline.html'))
        } }
      },
      keys: async () => [...oldCaches, currentCache],
      delete: async (name) => { deleted.push(name); return true },
      match: async (url) => stored.has(url) ? new Response(stored.get(url)) : undefined,
    },
  })
  const lifecycle = async (type) => {
    let pending
    handlers[type]({ waitUntil: (promise) => { pending = promise } })
    await pending
  }
  return {
    stored, deleted, lifecycle,
    get currentCache() { return currentCache },
    get claimed() { return claimed },
    navigate: async () => {
      let response
      handlers.fetch({
        request: { method: 'GET', url: 'https://portfolio.test/projects/example', mode: 'navigate' },
        respondWith: (promise) => { response = promise },
      })
      return (await response).text()
    },
  }
}

test('service-worker upgrade replaces the old offline cache and serves the new dark page', async () => {
  const worker = workerHarness()
  await worker.lifecycle('install')
  await worker.lifecycle('activate')
  assert.notEqual(worker.currentCache, 'portfolio-assets-v14')
  assert.deepEqual(worker.deleted, ['portfolio-assets-v14'])
  assert.equal(worker.claimed, true)
  assert.equal(await worker.navigate(), read('public/offline.html'))
  assertDarkOffline(await worker.navigate())
})

test('failed offline navigation still has a dark emergency response if the cache is missing', async () => {
  const worker = workerHarness()
  assertDarkOffline(await worker.navigate())
})
