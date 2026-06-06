import assert from 'node:assert/strict'
import test from 'node:test'

import {
  getHomeEndeavorAccent,
  getHomeEndeavorDescription,
  getHomeEndeavorHoverDistance,
  getHomeEndeavorListState,
  getHomeEndeavorMeta,
  getHomeEndeavorRowState,
  getHomeEndeavorRowStyleVars,
  getHomeEndeavorThumbnail,
} from './home-endeavors.ts'

const links = [
  {
    label: 'Studio Alpine',
    href: 'https://instagram.com/studio.alpine',
    external: true,
  },
  {
    label: 'Available for freelance',
    href: '/contact',
  },
]

test('home endeavor display helpers provide stable accents and descriptions', () => {
  assert.equal(getHomeEndeavorAccent('Studio Alpine'), '#2f7d73')
  assert.equal(getHomeEndeavorAccent('Available for freelance'), '#2f7d73')
  assert.equal(getHomeEndeavorAccent('Unknown'), '#2f7d73')
  assert.equal(getHomeEndeavorDescription('Studio Alpine'), 'Photography and lifestyle.')
  assert.equal(getHomeEndeavorDescription('Available for freelance'), 'Design and web work.')
  assert.equal(getHomeEndeavorDescription('Unknown'), 'A current creative or professional thread.')
  assert.equal(getHomeEndeavorMeta('Studio Alpine'), 'Studio')
  assert.equal(getHomeEndeavorMeta('Available for freelance'), 'Open')
  assert.equal(getHomeEndeavorMeta('Unknown'), 'Now')
  assert.deepEqual(getHomeEndeavorThumbnail('studio-alpine'), {
    alt: 'Studio Alpine camera icon',
    src: '/images/optimized/endeavors/studio-alpine-camera-object-icon.png',
  })
  assert.deepEqual(getHomeEndeavorThumbnail('handshake'), {
    alt: 'Freelance coffee icon',
    src: '/images/optimized/endeavors/freelance-coffee-object-icon.png',
  })
  assert.equal(getHomeEndeavorThumbnail(), null)
})

test('home endeavor row style vars reuse shared hover math with endeavor accents', () => {
  assert.deepEqual(getHomeEndeavorRowStyleVars('Studio Alpine', 1), {
    '--editorial-accent': '#2f7d73',
    '--featured-row-highlight-bg': 'color-mix(in srgb, #2f7d73 5%, rgba(var(--background-rgb), 0.58))',
    '--featured-row-highlight-border': 'color-mix(in srgb, #2f7d73 16%, transparent)',
    '--featured-row-highlight-shadow': 'color-mix(in srgb, #2f7d73 10%, transparent)',
  })
  assert.equal(getHomeEndeavorRowStyleVars('Available for freelance', 0)['--editorial-accent'], '#2f7d73')
  assert.equal(
    getHomeEndeavorRowStyleVars('Unknown', 8)['--featured-row-highlight-border'],
    'color-mix(in srgb, #2f7d73 16%, transparent)',
  )
})

test('home endeavor hover distance resolves null and active row offsets', () => {
  assert.equal(getHomeEndeavorHoverDistance(null, 1), 0)
  assert.equal(getHomeEndeavorHoverDistance(1, 1), 0)
  assert.equal(getHomeEndeavorHoverDistance(0, 2), 2)
})

test('home endeavor row state resolves active, muted, and hover distance', () => {
  assert.deepEqual(getHomeEndeavorRowState('Studio Alpine', 0, null), {
    active: false,
    hoverDistance: 0,
    index: 0,
    label: 'Studio Alpine',
    muted: false,
  })
  assert.deepEqual(getHomeEndeavorRowState('Studio Alpine', 0, { label: 'Studio Alpine', index: 0 }), {
    active: true,
    hoverDistance: 0,
    index: 0,
    label: 'Studio Alpine',
    muted: false,
  })
  assert.deepEqual(getHomeEndeavorRowState('Studio Alpine', 0, { label: 'Available for freelance', index: 1 }), {
    active: false,
    hoverDistance: 1,
    index: 0,
    label: 'Studio Alpine',
    muted: true,
  })
})

test('home endeavor list state packages rows for hover/focus transitions', () => {
  assert.deepEqual(getHomeEndeavorListState(links, { label: 'Studio Alpine', index: 0 }), {
    hasHoveredEndeavor: true,
    rows: [
      {
        active: true,
        hoverDistance: 0,
        index: 0,
        label: 'Studio Alpine',
        muted: false,
      },
      {
        active: false,
        hoverDistance: 1,
        index: 1,
        label: 'Available for freelance',
        muted: true,
      },
    ],
  })
})
