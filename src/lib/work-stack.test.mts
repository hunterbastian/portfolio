import assert from 'node:assert/strict'
import { readFileSync } from 'node:fs'
import test from 'node:test'

import type { HomeProject } from './home-projects.ts'
import {
  HOME_PLAYGROUND_STACK_LIMIT,
  PLAYGROUND_STACK_SLOTS,
  PROJECT_STACK_SLOTS,
  WORK_STACK_ASPECT_RATIO,
  getWorkStackCardStyle,
  getWorkStackCards,
  getWorkStackSlots,
} from './work-stack.ts'

function project(slug: string, title = slug): HomeProject {
  return {
    slug,
    frontmatter: {
      title,
      description: `${title} description`,
      category: 'Web Design',
      tags: [],
      image: `/images/${slug}.webp`,
      date: '2026-04-02',
    },
  }
}

test('work stack slots stay unique piles for projects and playground', () => {
  assert.equal(getWorkStackSlots('projects'), PROJECT_STACK_SLOTS)
  assert.equal(getWorkStackSlots('playground'), PLAYGROUND_STACK_SLOTS)
  assert.notDeepEqual(PROJECT_STACK_SLOTS[0], PLAYGROUND_STACK_SLOTS[0])
  assert.equal(HOME_PLAYGROUND_STACK_LIMIT, 9)
  assert.ok(PLAYGROUND_STACK_SLOTS.length >= HOME_PLAYGROUND_STACK_LIMIT)
})

test('getWorkStackCards maps project media onto the matching scatter slots', () => {
  const cards = getWorkStackCards([
    project('lumo', 'Lumo'),
    project('wander-utah', 'WanderUtah'),
  ], 'projects')

  assert.equal(cards.length, 2)
  assert.deepEqual(cards[0], {
    href: '/projects/lumo',
    image: '/images/lumo.webp',
    imageZoom: undefined,
    layout: PROJECT_STACK_SLOTS[0],
    slug: 'lumo',
    title: 'Lumo',
    year: '2026',
  })
  assert.equal(cards[1]?.layout, PROJECT_STACK_SLOTS[1])
})

test('collage cards use case-study photos instead of home object icons', () => {
  const lumo = project('lumo', 'Lumo')
  lumo.frontmatter.homeImage = '/images/optimized/projects/lumo-orb-object-icon.png'
  lumo.frontmatter.image = '/images/optimized/projects/lumo.webp'
  lumo.frontmatter.imageZoom = 1.4

  const [card] = getWorkStackCards([lumo], 'projects')

  assert.equal(card?.image, '/images/optimized/projects/lumo.webp')
  assert.equal(card?.imageZoom, 1.4)
  assert.equal(card?.image.includes('object-icon'), false)
})

test('playground stacks cap at the pile limit and keep experiment hrefs', () => {
  const projects = Array.from({ length: 12 }, (_, index) => project(`item-${index}`))
  const cards = getWorkStackCards(projects, 'playground')

  assert.equal(cards.length, HOME_PLAYGROUND_STACK_LIMIT)
  assert.equal(cards[8]?.href, '/projects/item-8')
  assert.equal(cards[8]?.layout, PLAYGROUND_STACK_SLOTS[8])
})

test('stack card style uses percent placement and the aspect token', () => {
  const style = getWorkStackCardStyle(PROJECT_STACK_SLOTS[0])

  assert.equal(style.left, '31%')
  assert.equal(style.top, '14%')
  assert.equal(style.width, '40%')
  assert.equal(style.zIndex, 8)
  assert.equal(style['--stack-rotate'], '-7deg')
  assert.equal(style.aspectRatio, WORK_STACK_ASPECT_RATIO.portrait)
})

test('scatter stack does not preload below-fold collage images', () => {
  const source = readFileSync(new URL('../components/home/WorkScatterStack.tsx', import.meta.url), 'utf8')
  assert.equal(source.includes('priority='), false)
})

test('scatter photos sit full-bleed without polaroid mats', () => {
  const source = readFileSync(new URL('../components/home/WorkScatterStack.tsx', import.meta.url), 'utf8')
  const css = readFileSync(new URL('../components/home/WorkScatterStack.module.css', import.meta.url), 'utf8')

  assert.ok(source.includes('aspectRatio: layoutStyle.aspectRatio'))
  assert.ok(source.includes('getProjectCardImageZoomStyle(card.imageZoom)'))
  assert.equal(source.includes('styles.caption'), false)
  assert.equal(css.includes('padding: 5px 5px 0'), false)
  assert.ok(css.includes('filter: blur(1.5px)'))
  assert.ok(css.includes('.stack:has(.card:hover) .card'))
})

test('scatter prints use named materials instead of ghost cards', () => {
  const source = readFileSync(new URL('../components/home/WorkScatterStack.module.css', import.meta.url), 'utf8')

  assert.ok(source.includes('border-radius: 8px'))
  assert.ok(source.includes('box-shadow: var(--shadow-raised)'))
  assert.ok(source.includes('box-shadow: var(--shadow-hover)'))
  assert.ok(source.includes('cubic-bezier(0.16, 1, 0.3, 1)'))
  assert.ok(source.includes('scale(0.96)'))
  assert.equal(source.includes('scale(1.08)'), false)
  assert.equal(source.includes('border-radius: 3px'), false)
  assert.equal(source.includes('border-radius: 2px'), false)
})
