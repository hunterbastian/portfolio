import assert from 'node:assert/strict'
import test from 'node:test'

import { STATIC_SITEMAP_ROUTES, getProjectSitemapEntry, getSitemapEntries, getStaticSitemapEntries } from './sitemap.ts'

test('STATIC_SITEMAP_ROUTES preserves route priorities and cadence', () => {
  assert.deepEqual(STATIC_SITEMAP_ROUTES, [
    { path: '', changeFrequency: 'weekly', priority: 1 },
    { path: '/about', changeFrequency: 'monthly', priority: 0.9 },
    { path: '/cv', changeFrequency: 'monthly', priority: 0.7 },
    { path: '/archive', changeFrequency: 'monthly', priority: 0.6 },
  ])
})

test('getStaticSitemapEntries resolves static route URLs', () => {
  const lastModified = new Date('2026-01-01T00:00:00.000Z')

  assert.deepEqual(getStaticSitemapEntries(lastModified), [
    { url: 'https://hunterbastian.com/', lastModified, changeFrequency: 'weekly', priority: 1 },
    { url: 'https://hunterbastian.com/about', lastModified, changeFrequency: 'monthly', priority: 0.9 },
    { url: 'https://hunterbastian.com/cv', lastModified, changeFrequency: 'monthly', priority: 0.7 },
    { url: 'https://hunterbastian.com/archive', lastModified, changeFrequency: 'monthly', priority: 0.6 },
  ])
})

test('getProjectSitemapEntry uses project date before fallback date', () => {
  const fallbackDate = new Date('2026-01-01T00:00:00.000Z')

  assert.deepEqual(getProjectSitemapEntry({ slug: 'lumo', frontmatter: { date: '2026-02-14' } }, fallbackDate), {
    url: 'https://hunterbastian.com/projects/lumo',
    lastModified: new Date('2026-02-14'),
    changeFrequency: 'monthly',
    priority: 0.8,
  })
  assert.deepEqual(getProjectSitemapEntry({ slug: 'untitled' }, fallbackDate), {
    url: 'https://hunterbastian.com/projects/untitled',
    lastModified: fallbackDate,
    changeFrequency: 'monthly',
    priority: 0.8,
  })
})

test('getSitemapEntries appends project entries after static routes', () => {
  const lastModified = new Date('2026-01-01T00:00:00.000Z')
  const entries = getSitemapEntries([
    { slug: 'lumo', frontmatter: { date: '2026-02-14' } },
    { slug: 'wanderutah', frontmatter: { date: '2025-05-01' } },
  ], lastModified)

  assert.equal(entries.length, 6)
  assert.deepEqual(entries.slice(0, 4).map((entry) => entry.url), [
    'https://hunterbastian.com/',
    'https://hunterbastian.com/about',
    'https://hunterbastian.com/cv',
    'https://hunterbastian.com/archive',
  ])
  assert.deepEqual(entries.slice(4).map((entry) => entry.url), [
    'https://hunterbastian.com/projects/lumo',
    'https://hunterbastian.com/projects/wanderutah',
  ])
})
