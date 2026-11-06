import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import { siteConfig } from './site.ts'
import { HOME_GRID_PIECES } from './home-grid.ts'
import { HOME_SHOWCASE_SLUGS, SHOWCASE_WEBSITE_PROJECT_LINE } from './home-showcase.ts'
import { getAllProjects, getArchivedProjects } from './projects.ts'
import {
  CARDS_CANVAS,
  CARDS_INK,
  CARDS_MUTED,
  encodePublicSrc,
  getCardsHomeBio,
  getCardsHomeLinks,
  getPortfolioProjectCards,
} from './cards-portfolio.ts'

test('public image paths keep their slashes and encode spaces', () => {
  assert.equal(encodePublicSrc('/showcase/rain.webp'), '/showcase/rain.webp')
  assert.equal(
    encodePublicSrc('/images/optimized/projects/Iceland Logo.webp'),
    '/images/optimized/projects/Iceland%20Logo.webp',
  )
})

test('home links keep the current contact row and add projects', () => {
  assert.deepEqual(getCardsHomeLinks().map((link) => link.label), [
    'Projects',
    'Start a project',
    'Resume',
    'Email',
    'LinkedIn',
    'GitHub',
    'Studio Alpine',
    'Studio Cala',
  ])
  assert.equal(getCardsHomeLinks()[0]?.href, '/projects')
  assert.equal(getCardsHomeLinks()[2]?.href, '/cv')

  const bio = getCardsHomeBio()
  assert.equal(bio.body, siteConfig.siteDescription)
  assert.equal(bio.hire, SHOWCASE_WEBSITE_PROJECT_LINE)
  assert.equal(bio.body.includes('from first sketch to shipped code'), false)
})

test('gallery frames collapse into one card per project', () => {
  const projects = [...getAllProjects(), ...getArchivedProjects()]
  const cards = getPortfolioProjectCards(projects)
  const ids = cards.map((card) => card.id)

  assert.equal(new Set(ids).size, ids.length)
  assert.ok(cards.length < HOME_GRID_PIECES.length)
  assert.deepEqual(ids.slice(0, HOME_SHOWCASE_SLUGS.length), [...HOME_SHOWCASE_SLUGS])

  const rain = cards.find((card) => card.id === 'rain')
  const middleEarth = cards.find((card) => card.id === 'middle-earth-journey')
  const iceland = cards.find((card) => card.id === 'iceland')
  const lumo = cards.find((card) => card.id === 'lumo')
  const studioAlpine = cards.find((card) => card.id === 'studio-alpine')
  const mountain = cards.find((card) => card.id === 'mountain')
  const alder = cards.find((card) => card.id === 'alder')
  const form = cards.find((card) => card.id === 'form')

  assert.equal(cards.filter((card) => card.id === 'rain').length, 1)
  assert.equal(rain?.title, 'RAIN')
  assert.equal(rain?.imageSrc, '/showcase/rain.webp')
  assert.equal(rain?.href, '/projects/rain')
  assert.equal(middleEarth?.title, 'Middle-Earth Journey')
  assert.equal(middleEarth?.href, '/projects/middle-earth-journey')
  assert.equal(iceland?.title, 'Iceland')
  assert.equal(iceland?.href, '/projects/iceland-logo')
  assert.equal(lumo?.title, 'Lumo')
  assert.equal(lumo?.imageSrc, '/showcase/lumo.webp')
  assert.equal(studioAlpine?.title, 'Studio Alpine')
  assert.equal(studioAlpine?.external, true)
  assert.equal(mountain?.title, 'Mountain')
  assert.equal(mountain?.href, '/projects/mountain')
  assert.equal(alder?.external, true)
  assert.equal(form?.title, 'Form')
  assert.equal(cards.some((card) => card.title === 'RAIN dusk'), false)
  assert.equal(cards.some((card) => card.title === 'Middle-Earth sketches'), false)
})

test('cards pages use the tuned dark palette and do not follow the device theme', () => {
  const css = readFileSync(new URL('../app/cards.css', import.meta.url), 'utf8')
  const layout = readFileSync(new URL('../app/layout.tsx', import.meta.url), 'utf8')

  assert.equal(CARDS_CANVAS, '#0E0E0D')
  assert.equal(CARDS_INK, '#EDEBE6')
  assert.equal(CARDS_MUTED, '#8F8D88')
  const cssFolded = css.toLowerCase()
  assert.ok(cssFolded.includes(CARDS_CANVAS.toLowerCase()))
  assert.ok(cssFolded.includes(CARDS_INK.toLowerCase()))
  assert.ok(cssFolded.includes(CARDS_MUTED.toLowerCase()))
  assert.equal(css.includes('prefers-color-scheme'), false)
  assert.equal(css.toLowerCase().includes('geist'), false)
  assert.ok(layout.includes('dataset.cardsPortfolio="true"'))
  assert.ok(layout.includes('path==="/"||path==="/projects"'))
  assert.equal(layout.includes('prefers-color-scheme'), false)
  assert.equal(layout.includes('pl.href="/showcase/"+slugs[hi]+".webp"'), false)
})
