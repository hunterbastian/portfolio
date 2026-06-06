import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  PROJECT_CARD_HAPTIC_STYLE,
  PROJECT_CARD_OPEN_TOAST,
  PROJECT_CARD_PLACEHOLDER_SRC,
  activateProjectCard,
  getProjectCardActionState,
  getProjectCardAnimationDelay,
  getProjectCardDemoAriaLabel,
  getProjectCardDisplayState,
  getProjectCardHref,
  getProjectCardImageAlt,
  getProjectCardImageFrameClassName,
  getProjectCardImagePriorityProps,
  getProjectCardImageTransitionClassName,
  getProjectCardImageZoomStyle,
  getProjectCardTitle,
  getProjectCardTransitionRect,
  shouldPrioritizeProjectCardImage,
  shouldShowProjectCardLiveBadge,
} from './project-card.ts'
import type { ProjectFrontmatter } from '@/types/project'

const frontmatter: ProjectFrontmatter = {
  title: 'Lumo',
  description: 'Mindfulness app for calm reflection.',
  category: 'Product Design',
  tags: ['mobile'],
  image: '/images/lumo.webp',
  date: '2026-01-01',
}

test('project card display helpers preserve title, image, and frame rules', () => {
  assert.equal(getProjectCardTitle({ ...frontmatter, displayTitle: 'Lumo App' }), 'Lumo App')
  assert.equal(getProjectCardTitle(frontmatter), 'Lumo')
  assert.equal(getProjectCardImageAlt(frontmatter), 'Preview of Lumo')
  assert.equal(getProjectCardDemoAriaLabel('Lumo App'), 'Live demo for Lumo App')
  assert.equal(getProjectCardHref('lumo'), '/projects/lumo')
  assert.equal(getProjectCardImageFrameClassName(true), 'project-card-image-frame project-card-image-frame--square')
  assert.equal(
    getProjectCardImageFrameClassName(false),
    'project-card-image-frame project-card-image-frame--wide img-inset-outline',
  )
  assert.equal(PROJECT_CARD_HAPTIC_STYLE, 'medium')
  assert.equal(PROJECT_CARD_PLACEHOLDER_SRC, '/images/placeholder.svg')
  assert.equal(PROJECT_CARD_OPEN_TOAST, 'Opening project')
})

test('project card timing and priority helpers keep image loading predictable', () => {
  assert.equal(shouldPrioritizeProjectCardImage(0), true)
  assert.equal(shouldPrioritizeProjectCardImage(3, true), true)
  assert.equal(shouldPrioritizeProjectCardImage(3, false), false)
  assert.equal(getProjectCardAnimationDelay(3), '240ms')
  assert.deepEqual(getProjectCardImagePriorityProps(true), { loading: 'eager', fetchPriority: 'high' })
  assert.deepEqual(getProjectCardImagePriorityProps(false), { loading: 'lazy', fetchPriority: 'low' })
})

test('project card image class helper preserves opacity and first-card transition variants', () => {
  assert.equal(
    getProjectCardImageTransitionClassName(0, true),
    'object-cover transition-[transform,filter] duration-500 ease-soft group-hover:scale-[1.015] group-hover:saturate-[0.96] opacity-100',
  )
  assert.equal(
    getProjectCardImageTransitionClassName(2, false),
    'object-cover transition-[transform,opacity,filter] duration-500 ease-soft group-hover:scale-[1.015] group-hover:saturate-[0.96] opacity-0',
  )
  assert.deepEqual(getProjectCardImageZoomStyle(1.08), { transform: 'scale(1.08)' })
  assert.equal(getProjectCardImageZoomStyle(0), undefined)
  assert.equal(getProjectCardImageZoomStyle(), undefined)
})

test('project card live badge helper preserves demo and hide flag behavior', () => {
  assert.equal(shouldShowProjectCardLiveBadge('https://example.com/demo'), true)
  assert.equal(shouldShowProjectCardLiveBadge('https://example.com/demo', true), false)
  assert.equal(shouldShowProjectCardLiveBadge(undefined, false), false)
})

test('project card display state packages title, category, demo, and priority', () => {
  assert.deepEqual(
    getProjectCardDisplayState({
      frontmatter: {
        ...frontmatter,
        displayTitle: 'Lumo App',
        demo: 'https://example.com/demo',
      },
      index: 3,
      priorityImage: true,
    }),
    {
      categoryLabel: 'UX/UI, PRODUCT',
      demoHref: 'https://example.com/demo',
      displayTitle: 'Lumo App',
      imagePriorityProps: { loading: 'eager', fetchPriority: 'high' },
      shouldPrioritizeImage: true,
    },
  )
  assert.deepEqual(
    getProjectCardDisplayState({
      frontmatter: {
        ...frontmatter,
        demo: 'https://example.com/demo',
      },
      hideLiveBadge: true,
      index: 3,
    }),
    {
      categoryLabel: 'UX/UI, PRODUCT',
      demoHref: undefined,
      displayTitle: 'Lumo',
      imagePriorityProps: { loading: 'lazy', fetchPriority: 'low' },
      shouldPrioritizeImage: false,
    },
  )
})

test('project card action state preserves route, analytics, and toast contracts', () => {
  assert.deepEqual(getProjectCardActionState({ slug: 'lumo', displayTitle: 'Lumo App' }), {
    analyticsTitle: 'Lumo App',
    href: '/projects/lumo',
    slug: 'lumo',
    toast: 'Opening project',
  })
})

test('getProjectCardTransitionRect keeps only shared transition geometry', () => {
  assert.deepEqual(
    getProjectCardTransitionRect({ top: 10, left: 20, width: 300, height: 180 }),
    { top: 10, left: 20, width: 300, height: 180 },
  )
})

test('activateProjectCard preserves haptic, analytics, toast, and transition ordering', () => {
  const actionState = getProjectCardActionState({ slug: 'lumo', displayTitle: 'Lumo App' })
  const transitionRect = { top: 10, left: 20, width: 300, height: 180 }
  const calls: unknown[] = []

  activateProjectCard({
    actionState,
    imageSrc: '/images/lumo.webp',
    showToast: (message) => calls.push(['toast', message]),
    startTransition: (slug, imageSrc, rect) => calls.push(['transition', slug, imageSrc, rect]),
    trackProjectClick: (slug, title) => calls.push(['analytics', slug, title]),
    transitionRect,
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'medium'],
    ['analytics', 'lumo', 'Lumo App'],
    ['toast', 'Opening project'],
    ['transition', 'lumo', '/images/lumo.webp', transitionRect],
  ])
})

test('activateProjectCard skips transition when no shared geometry is available', () => {
  const actionState = getProjectCardActionState({ slug: 'lumo', displayTitle: 'Lumo App' })
  const calls: unknown[] = []

  activateProjectCard({
    actionState,
    imageSrc: '/images/lumo.webp',
    showToast: (message) => calls.push(['toast', message]),
    startTransition: (slug) => calls.push(['transition', slug]),
    trackProjectClick: (slug, title) => calls.push(['analytics', slug, title]),
    triggerHaptic: (style) => calls.push(['haptic', style]),
  })

  assert.deepEqual(calls, [
    ['haptic', 'medium'],
    ['analytics', 'lumo', 'Lumo App'],
    ['toast', 'Opening project'],
  ])
})
