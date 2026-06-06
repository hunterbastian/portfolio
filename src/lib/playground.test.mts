import assert from 'node:assert/strict'
import test from 'node:test'

import { MOTION_EASE_SOFT } from './motion.ts'
import {
  formatPlaygroundRange,
  formatPlaygroundYear,
  formatPlaygroundProjectCount,
  formatPlaygroundPosition,
  getNextPlaygroundOrbitAnimationFrame,
  getNextPlaygroundOrbitStep,
  getPlaygroundCardTilt,
  getPlaygroundCenterHubState,
  getPlaygroundCenterHubStateFromCardState,
  getPlaygroundEntranceDurationMs,
  getPlaygroundGalleryTileStates,
  getPlaygroundGalleryTileVariant,
  getPlaygroundMastheadMetrics,
  getPlaygroundMobileManifestState,
  getPlaygroundMobileManifestEntranceTransition,
  getPlaygroundMobileTileStates,
  getPlaygroundMobileViewState,
  getPlaygroundMotionInitial,
  getPlaygroundOrbitBaseAngle,
  getPlaygroundOrbitCardLayout,
  getPlaygroundOrbitCardStates,
  getPlaygroundOrbitCardEntranceMotion,
  getPlaygroundOrbitCardEntranceDelay,
  getPlaygroundOrbitCardEntranceTransition,
  getPlaygroundOrbitCardFrame,
  getPlaygroundOrbitCardHoverScale,
  getPlaygroundOrbitCardInnerClassName,
  getPlaygroundOrbitCardRestFrame,
  getPlaygroundOrbitCardSize,
  getPlaygroundOrbitCardZIndex,
  getPlaygroundOrbitCenterEntranceMotion,
  getPlaygroundOrbitCenterEntranceTransition,
  getPlaygroundOrbitCoordinates,
  getPlaygroundOrbitDepth,
  getPlaygroundOrbitInteractionFilter,
  getPlaygroundOrbitOpacity,
  getPlaygroundOrbitQuickSwapTransition,
  getPlaygroundOrbitRestFilter,
  getPlaygroundOrbitResponsiveRadius,
  getPlaygroundOrbitScale,
  getPlaygroundOrbitRenderState,
  getPlaygroundOrbitSelection,
  getPlaygroundOrbitSpeedHoverIndex,
  getPlaygroundOrbitSpeedTarget,
  getPlaygroundOrbitVerticalSwapMotion,
  getPlaygroundOrbitViewportSnapshot,
  getPlaygroundOrbitViewState,
  getPlaygroundOrbitZIndex,
  getPlaygroundProjectCardDisplayState,
  getPlaygroundProjectDisplayMeta,
  getPlaygroundRouteCode,
  getPlaygroundVerticalEntranceMotion,
  getProjectDisplayTitle,
  getProjectPrimaryTag,
  PLAYGROUND_EMPTY_COPY,
  PLAYGROUND_DEFAULT_ORBIT_RADIUS_DESKTOP,
  PLAYGROUND_DEFAULT_ORBIT_RADIUS_LARGE,
  PLAYGROUND_FLIGHT_DECK_LABEL,
  PLAYGROUND_FLIGHT_DECK_MODE,
  PLAYGROUND_FLIGHT_DECK_TITLE,
  PLAYGROUND_GALLERY_LABEL,
  PLAYGROUND_GALLERY_TILE_VARIANTS,
  PLAYGROUND_GALLERY_TITLE,
  PLAYGROUND_MASTHEAD_KICKER,
  PLAYGROUND_MASTHEAD_METRIC_LABELS,
  PLAYGROUND_MASTHEAD_MODE,
  PLAYGROUND_MASTHEAD_SUMMARY_LABEL,
  PLAYGROUND_MASTHEAD_TITLE,
  PLAYGROUND_ORBIT_CARD_ACTIVE_FILTER,
  PLAYGROUND_ORBIT_CARD_FULL_FILTER,
  PLAYGROUND_ORBIT_CARD_HOVER_SCALE,
  PLAYGROUND_ORBIT_CARD_HOVER_Z_INDEX,
  PLAYGROUND_ORBIT_CARD_MUTED_FILTER,
  PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DELAY,
  PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DURATION,
  PLAYGROUND_ORBIT_CENTER_ENTRANCE_DURATION,
  PLAYGROUND_ORBIT_COMPACT_HEIGHT,
  PLAYGROUND_ORBIT_ENTRANCE,
  PLAYGROUND_ORBIT_QUICK_SWAP_DURATION,
  PLAYGROUND_ORBIT_LARGE_VIEWPORT_WIDTH,
  PLAYGROUND_ORBIT_MEDIUM_HEIGHT,
  PLAYGROUND_ORBIT_MEDIUM_RADIUS,
  PLAYGROUND_ORBIT_NORMAL_SPEED,
  PLAYGROUND_ORBIT_RADIUS_DESKTOP,
  PLAYGROUND_ORBIT_RADIUS_LARGE,
  PLAYGROUND_ORBIT_SLOW_SPEED,
  PLAYGROUND_ORBIT_TIGHT_RADIUS,
  schedulePlaygroundOrbitActivation,
  shouldPrioritizePlaygroundImage,
  shouldClearPlaygroundHoverOnBlur,
  sortProjectsForPlayground,
} from './playground.ts'
import type { Project } from '../types/project.ts'

function project(
  slug: string,
  date: string,
  title = slug,
  tags: string[] = ['Creative Coding'],
  category = 'Web Design',
  displayTitle?: string,
): Project {
  return {
    slug,
    frontmatter: {
      title,
      displayTitle,
      description: `${title} description`,
      category,
      tags,
      image: `/images/${slug}.webp`,
      date,
    },
    content: '',
  }
}

test('sortProjectsForPlayground honors preferred order before date fallback', () => {
  const projects = [
    project('custom-new', '2026-01-01'),
    project('sky-farm', '2024-01-01'),
    project('path', '2023-01-01'),
    project('custom-old', '2025-01-01'),
  ]

  assert.deepEqual(
    sortProjectsForPlayground(projects).map((item) => item.slug),
    ['path', 'sky-farm', 'custom-new', 'custom-old'],
  )
})

test('formatPlaygroundRange compacts invalid and single-year project dates', () => {
  assert.equal(formatPlaygroundRange([]), 'Now')
  assert.equal(formatPlaygroundRange([project('a', 'bad-date')]), 'Now')
  assert.equal(formatPlaygroundRange([project('a', '2026-03-01')]), '2026')
  assert.equal(formatPlaygroundRange([project('a', '2023-01-01'), project('b', '2026-01-01')]), '2023-2026')
})

test('playground display helpers provide stable fallbacks', () => {
  const titled = project('sky-farm', '2026-03-16', 'Sky Farm', [], 'Creative Coding', 'Sky Farm Lab')
  const fallback = project('', 'not-a-date', 'Untitled', [], 'Graphic Design')

  assert.equal(getProjectDisplayTitle(titled), 'Sky Farm Lab')
  assert.equal(getProjectDisplayTitle(fallback), 'Untitled')
  assert.equal(getProjectPrimaryTag(titled), 'Creative Coding')
  assert.equal(formatPlaygroundYear(titled.frontmatter.date), '2026')
  assert.equal(formatPlaygroundYear(fallback.frontmatter.date), 'Now')
  assert.equal(getPlaygroundRouteCode(titled, 1), 'SF-02')
  assert.equal(getPlaygroundRouteCode(fallback, 0), 'PG-01')
  assert.equal(formatPlaygroundPosition(0, 8), '01/08')
  assert.equal(formatPlaygroundPosition(11, 12), '12/12')
  assert.deepEqual(getPlaygroundProjectDisplayMeta(titled, 1, 8), {
    category: 'Creative Coding',
    position: '02/08',
    primaryTag: 'Creative Coding',
    routeCode: 'SF-02',
    title: 'Sky Farm Lab',
    year: '2026',
  })
  assert.deepEqual(getPlaygroundProjectCardDisplayState(titled, 1, 8), {
    index: 1,
    meta: {
      category: 'Creative Coding',
      position: '02/08',
      primaryTag: 'Creative Coding',
      routeCode: 'SF-02',
      title: 'Sky Farm Lab',
      year: '2026',
    },
    priorityImage: true,
    project: titled,
  })
  assert.deepEqual(getPlaygroundProjectCardDisplayState(titled, 4, 8), {
    index: 4,
    meta: {
      category: 'Creative Coding',
      position: '05/08',
      primaryTag: 'Creative Coding',
      routeCode: 'SF-05',
      title: 'Sky Farm Lab',
      year: '2026',
    },
    priorityImage: false,
    project: titled,
  })
  assert.deepEqual(getPlaygroundCenterHubState(titled, 1, 8), {
    contentKey: 'sky-farm',
    meta: {
      category: 'Creative Coding',
      position: '02/08',
      primaryTag: 'Creative Coding',
      routeCode: 'SF-02',
      title: 'Sky Farm Lab',
      year: '2026',
    },
  })
  assert.deepEqual(
    getPlaygroundCenterHubStateFromCardState(getPlaygroundProjectCardDisplayState(titled, 1, 8)),
    {
      contentKey: 'sky-farm',
      meta: {
        category: 'Creative Coding',
        position: '02/08',
        primaryTag: 'Creative Coding',
        routeCode: 'SF-02',
        title: 'Sky Farm Lab',
        year: '2026',
      },
    },
  )
})

test('playground mobile manifest state resolves lead project display copy', () => {
  const projects = [
    project('sky-farm', '2026-03-16', 'Sky Farm', ['Prototype'], 'Creative Coding', 'Sky Farm Lab'),
    project('path', '2025-01-01'),
  ]

  assert.deepEqual(getPlaygroundMobileManifestState([]), {
    leadMeta: null,
    routeCountLabel: '00',
  })
  assert.deepEqual(getPlaygroundMobileManifestState(projects), {
    leadMeta: {
      category: 'Creative Coding',
      position: '01/02',
      primaryTag: 'Prototype',
      routeCode: 'SF-01',
      title: 'Sky Farm Lab',
      year: '2026',
    },
    routeCountLabel: '02',
  })
})

test('playground mobile tile states resolve project meta and priority flags', () => {
  const projects = [
    project('sky-farm', '2026-03-16', 'Sky Farm', ['Prototype'], 'Creative Coding', 'Sky Farm Lab'),
    project('path', '2025-01-01'),
    project('constellation', '2024-01-01'),
    project('little-lands', '2023-01-01'),
    project('mountain', '2022-01-01'),
  ]

  assert.deepEqual(getPlaygroundMobileTileStates([]), [])
  assert.deepEqual(getPlaygroundMobileTileStates(projects), [
    {
      index: 0,
      meta: {
        category: 'Creative Coding',
        position: '01/05',
        primaryTag: 'Prototype',
        routeCode: 'SF-01',
        title: 'Sky Farm Lab',
        year: '2026',
      },
      priorityImage: true,
      project: projects[0],
    },
    {
      index: 1,
      meta: {
        category: 'Web Design',
        position: '02/05',
        primaryTag: 'Creative Coding',
        routeCode: 'P-02',
        title: 'path',
        year: '2025',
      },
      priorityImage: true,
      project: projects[1],
    },
    {
      index: 2,
      meta: {
        category: 'Web Design',
        position: '03/05',
        primaryTag: 'Creative Coding',
        routeCode: 'C-03',
        title: 'constellation',
        year: '2024',
      },
      priorityImage: true,
      project: projects[2],
    },
    {
      index: 3,
      meta: {
        category: 'Web Design',
        position: '04/05',
        primaryTag: 'Creative Coding',
        routeCode: 'LL-04',
        title: 'little-lands',
        year: '2023',
      },
      priorityImage: true,
      project: projects[3],
    },
    {
      index: 4,
      meta: {
        category: 'Web Design',
        position: '05/05',
        primaryTag: 'Creative Coding',
        routeCode: 'M-05',
        title: 'mountain',
        year: '2022',
      },
      priorityImage: false,
      project: projects[4],
    },
  ])
})

test('playground mobile view state packages manifest and tiles', () => {
  const projects = [
    project('sky-farm', '2026-03-16', 'Sky Farm', ['Prototype'], 'Creative Coding', 'Sky Farm Lab'),
    project('path', '2025-01-01'),
  ]

  assert.deepEqual(getPlaygroundMobileViewState([]), {
    manifest: {
      leadMeta: null,
      routeCountLabel: '00',
    },
    tileStates: [],
  })

  const viewState = getPlaygroundMobileViewState(projects)
  assert.deepEqual(viewState.manifest, {
    leadMeta: {
      category: 'Creative Coding',
      position: '01/02',
      primaryTag: 'Prototype',
      routeCode: 'SF-01',
      title: 'Sky Farm Lab',
      year: '2026',
    },
    routeCountLabel: '02',
  })
  assert.equal(viewState.tileStates.length, 2)
  assert.equal(viewState.tileStates[0].project, projects[0])
  assert.equal(viewState.tileStates[1].meta.routeCode, 'P-02')
})

test('playground motion initial helper disables entrances for reduced motion', () => {
  const initial = { opacity: 0, y: 8, filter: 'blur(4px)' }

  assert.equal(getPlaygroundMotionInitial(true, initial), false)
  assert.deepEqual(getPlaygroundMotionInitial(false, initial), initial)
  assert.equal(getPlaygroundOrbitCardInnerClassName(true), 'will-change-transform transition-none')
  assert.equal(
    getPlaygroundOrbitCardInnerClassName(false),
    'will-change-transform transition-[filter,transform] duration-700 ease-soft',
  )
})

test('playground hover blur helper preserves focus inside the card', () => {
  const child = {} as Node
  const sibling = {} as Node
  const target = {
    contains: (nextTarget: Node | null) => nextTarget === child,
  }

  assert.equal(shouldClearPlaygroundHoverOnBlur(target, child), false)
  assert.equal(shouldClearPlaygroundHoverOnBlur(target, sibling), true)
  assert.equal(shouldClearPlaygroundHoverOnBlur(target, null), true)
})

test('playground masthead and flight deck copy stay centralized', () => {
  assert.equal(PLAYGROUND_MASTHEAD_KICKER, 'Lab ops')
  assert.equal(PLAYGROUND_MASTHEAD_TITLE, 'Playground')
  assert.equal(PLAYGROUND_MASTHEAD_SUMMARY_LABEL, 'Playground summary')
  assert.deepEqual(PLAYGROUND_MASTHEAD_METRIC_LABELS, {
    routes: 'Routes',
    window: 'Window',
    mode: 'Mode',
  })
  assert.equal(PLAYGROUND_MASTHEAD_MODE, 'Orbit')
  assert.equal(PLAYGROUND_EMPTY_COPY, 'No archived projects yet.')
  assert.equal(PLAYGROUND_FLIGHT_DECK_LABEL, 'Playground experiments')
  assert.equal(PLAYGROUND_FLIGHT_DECK_TITLE, 'Experiment radar')
  assert.equal(PLAYGROUND_FLIGHT_DECK_MODE, 'Auto orbit')
})

test('playground gallery state preserves the reference-style tile rhythm', () => {
  const projects = Array.from({ length: 10 }, (_, index) => project(`project-${index}`, `2026-01-${String(index + 1).padStart(2, '0')}`))
  const tiles = getPlaygroundGalleryTileStates(projects)

  assert.equal(PLAYGROUND_GALLERY_LABEL, 'Playground gallery')
  assert.equal(PLAYGROUND_GALLERY_TITLE, 'Playground')
  assert.deepEqual([...PLAYGROUND_GALLERY_TILE_VARIANTS], ['portrait', 'feature', 'browser', 'document', 'phone', 'stack', 'address', 'print'])
  assert.equal(getPlaygroundGalleryTileVariant(9), 'feature')
  assert.equal(tiles.length, 8)
  assert.deepEqual(tiles.map((tile) => tile.variant), [...PLAYGROUND_GALLERY_TILE_VARIANTS])
  assert.equal(tiles[0].priorityImage, true)
  assert.equal(tiles[4].priorityImage, false)
})

test('playground masthead metrics and orbit radii preserve display contracts', () => {
  assert.equal(formatPlaygroundProjectCount(4), '04')
  assert.equal(formatPlaygroundProjectCount(12), '12')
  assert.deepEqual(getPlaygroundMastheadMetrics(4, '2023-2026'), [
    { label: 'Routes', value: '04' },
    { label: 'Window', value: '2023-2026' },
    { label: 'Mode', value: 'Orbit' },
  ])
  assert.equal(PLAYGROUND_ORBIT_RADIUS_DESKTOP, 230)
  assert.equal(PLAYGROUND_ORBIT_RADIUS_LARGE, 262)
  assert.equal(PLAYGROUND_DEFAULT_ORBIT_RADIUS_DESKTOP, 300)
  assert.equal(PLAYGROUND_DEFAULT_ORBIT_RADIUS_LARGE, 360)
  assert.equal(PLAYGROUND_ORBIT_LARGE_VIEWPORT_WIDTH, 1280)
  assert.equal(PLAYGROUND_ORBIT_COMPACT_HEIGHT, 780)
  assert.equal(PLAYGROUND_ORBIT_TIGHT_RADIUS, 198)
  assert.equal(PLAYGROUND_ORBIT_MEDIUM_HEIGHT, 860)
  assert.equal(PLAYGROUND_ORBIT_MEDIUM_RADIUS, 214)
})

test('orbit sizing helpers keep visual thresholds stable', () => {
  assert.equal(getPlaygroundCardTilt(0), -3)
  assert.equal(getPlaygroundCardTilt(1), 0)
  assert.equal(getPlaygroundCardTilt(2), 3)
  assert.equal(getPlaygroundOrbitBaseAngle(0, 4), 0)
  assert.equal(getPlaygroundOrbitBaseAngle(1, 4), 90)
  assert.equal(getPlaygroundOrbitBaseAngle(3, 4), 270)
  assert.equal(getPlaygroundOrbitBaseAngle(0, 0), 0)
  assert.equal(getPlaygroundOrbitCardSize(4), 144)
  assert.equal(getPlaygroundOrbitCardSize(5), 132)
  assert.equal(getPlaygroundOrbitCardSize(7), 120)
  assert.equal(getPlaygroundOrbitCardSize(9), 112)
  assert.equal(shouldPrioritizePlaygroundImage(3), true)
  assert.equal(shouldPrioritizePlaygroundImage(4), false)
})

test('responsive orbit radius clamps against viewport width and height', () => {
  assert.equal(
    getPlaygroundOrbitResponsiveRadius({
      radiusDesktop: 300,
      radiusLarge: 360,
      viewportHeight: 900,
      viewportWidth: 1279,
    }),
    300,
  )
  assert.equal(
    getPlaygroundOrbitResponsiveRadius({
      radiusDesktop: 300,
      radiusLarge: 360,
      viewportHeight: 900,
      viewportWidth: 1280,
    }),
    360,
  )
  assert.equal(
    getPlaygroundOrbitResponsiveRadius({
      radiusDesktop: 300,
      radiusLarge: 360,
      viewportHeight: 779,
      viewportWidth: 1500,
    }),
    198,
  )
  assert.equal(
    getPlaygroundOrbitResponsiveRadius({
      radiusDesktop: 300,
      radiusLarge: 360,
      viewportHeight: 820,
      viewportWidth: 1500,
    }),
    214,
  )
})

test('orbit viewport snapshot prefers visual viewport height when present', () => {
  assert.deepEqual(
    getPlaygroundOrbitViewportSnapshot({
      innerHeight: 900,
      innerWidth: 1440,
      visualViewport: { height: 760 },
    }),
    {
      viewportHeight: 760,
      viewportWidth: 1440,
    },
  )
  assert.deepEqual(
    getPlaygroundOrbitViewportSnapshot({
      innerHeight: 900,
      innerWidth: 1024,
    }),
    {
      viewportHeight: 900,
      viewportWidth: 1024,
    },
  )
})

test('orbit selection keeps active project and hover target state valid', () => {
  assert.deepEqual(
    getPlaygroundOrbitSelection({ hoveredIndex: null, projectCount: 0 }),
    { activeIndex: null, hasHoverTarget: false },
  )
  assert.deepEqual(
    getPlaygroundOrbitSelection({ hoveredIndex: null, projectCount: 4 }),
    { activeIndex: 0, hasHoverTarget: false },
  )
  assert.deepEqual(
    getPlaygroundOrbitSelection({ hoveredIndex: 2, projectCount: 4 }),
    { activeIndex: 2, hasHoverTarget: true },
  )
  assert.deepEqual(
    getPlaygroundOrbitSelection({ hoveredIndex: -1, projectCount: 4 }),
    { activeIndex: 0, hasHoverTarget: false },
  )
  assert.deepEqual(
    getPlaygroundOrbitSelection({ hoveredIndex: 9, projectCount: 4 }),
    { activeIndex: 0, hasHoverTarget: false },
  )
})

test('orbit render state resolves active project and render guard', () => {
  const projects = [
    project('path', '2023-01-01'),
    project('sky-farm', '2024-01-01'),
    project('constellation', '2025-01-01'),
  ]

  assert.deepEqual(getPlaygroundOrbitRenderState([], null), {
    activeIndex: null,
    activeProject: null,
    canRender: false,
    count: 0,
    selection: { activeIndex: null, hasHoverTarget: false },
  })
  assert.deepEqual(getPlaygroundOrbitRenderState(projects, null), {
    activeIndex: 0,
    activeProject: projects[0],
    canRender: true,
    count: 3,
    selection: { activeIndex: 0, hasHoverTarget: false },
  })
  assert.deepEqual(getPlaygroundOrbitRenderState(projects, 2), {
    activeIndex: 2,
    activeProject: projects[2],
    canRender: true,
    count: 3,
    selection: { activeIndex: 2, hasHoverTarget: true },
  })
  assert.deepEqual(getPlaygroundOrbitRenderState(projects, 9), {
    activeIndex: 0,
    activeProject: projects[0],
    canRender: true,
    count: 3,
    selection: { activeIndex: 0, hasHoverTarget: false },
  })
})

test('orbit card layout combines index geometry and active hover state', () => {
  assert.deepEqual(
    getPlaygroundOrbitCardLayout({
      index: 1,
      projectCount: 4,
      selection: { activeIndex: 0, hasHoverTarget: false },
    }),
    { baseAngle: 90, isHovered: false, tilt: 0 },
  )
  assert.deepEqual(
    getPlaygroundOrbitCardLayout({
      index: 2,
      projectCount: 4,
      selection: { activeIndex: 2, hasHoverTarget: true },
    }),
    { baseAngle: 180, isHovered: true, tilt: 3 },
  )
})

test('orbit card states combine projects with layout state', () => {
  const projects = [
    project('path', '2023-01-01'),
    project('sky-farm', '2024-01-01'),
  ]

  assert.deepEqual(
    getPlaygroundOrbitCardStates([], { activeIndex: null, hasHoverTarget: false }),
    [],
  )
  assert.deepEqual(
    getPlaygroundOrbitCardStates(projects, { activeIndex: 1, hasHoverTarget: true }),
    [
      {
        baseAngle: 0,
        index: 0,
        isHovered: false,
        meta: {
          category: 'Web Design',
          position: '01/02',
          primaryTag: 'Creative Coding',
          routeCode: 'P-01',
          title: 'path',
          year: '2023',
        },
        priorityImage: true,
        project: projects[0],
        tilt: -3,
      },
      {
        baseAngle: 180,
        index: 1,
        isHovered: true,
        meta: {
          category: 'Web Design',
          position: '02/02',
          primaryTag: 'Creative Coding',
          routeCode: 'SF-02',
          title: 'sky-farm',
          year: '2024',
        },
        priorityImage: true,
        project: projects[1],
        tilt: 0,
      },
    ],
  )
})

test('orbit view state packages cards, hub, sizing, and selection', () => {
  const projects = [
    project('path', '2023-01-01'),
    project('sky-farm', '2024-01-01'),
  ]

  assert.deepEqual(getPlaygroundOrbitViewState([], null), {
    activeHub: null,
    canRender: false,
    cardSize: 144,
    cardStates: [],
    count: 0,
    selection: { activeIndex: null, hasHoverTarget: false },
  })

  const resting = getPlaygroundOrbitViewState(projects, null)
  assert.equal(resting.canRender, true)
  assert.equal(resting.cardSize, 144)
  assert.deepEqual(resting.selection, { activeIndex: 0, hasHoverTarget: false })
  assert.deepEqual(resting.activeHub, {
    contentKey: 'path',
    meta: resting.cardStates[0].meta,
  })

  const hovered = getPlaygroundOrbitViewState(projects, 1)
  assert.deepEqual(hovered.selection, { activeIndex: 1, hasHoverTarget: true })
  assert.deepEqual(hovered.activeHub, {
    contentKey: 'sky-farm',
    meta: hovered.cardStates[1].meta,
  })
  assert.equal(hovered.cardStates[0].isHovered, false)
  assert.equal(hovered.cardStates[1].isHovered, true)
  assert.equal(hovered.cardStates[1].baseAngle, 180)
})

test('orbit geometry helpers preserve card depth and transform math', () => {
  assert.deepEqual(getPlaygroundOrbitCoordinates(0, 0, 100), { x: 0, y: -100 })
  assert.deepEqual(getPlaygroundOrbitCoordinates(90, 0, 100), { x: 100, y: -6.123233995736766e-15 })
  assert.equal(getPlaygroundOrbitDepth(0, 0), 0)
  assert.equal(getPlaygroundOrbitDepth(180, 0), 1)
  assert.equal(getPlaygroundOrbitScale(0), 0.88)
  assert.equal(getPlaygroundOrbitScale(1), 1)
  assert.equal(getPlaygroundOrbitOpacity(0), 0.58)
  assert.equal(getPlaygroundOrbitOpacity(1), 1)
  assert.equal(getPlaygroundOrbitRestFilter(0), 'brightness(0.82) blur(0px)')
  assert.equal(getPlaygroundOrbitRestFilter(1), 'brightness(1) blur(0px)')
  assert.equal(getPlaygroundOrbitZIndex(0), 1)
  assert.equal(getPlaygroundOrbitZIndex(1), 21)
  assert.deepEqual(getPlaygroundOrbitCardRestFrame(1), {
    filter: 'brightness(1) blur(0px)',
    opacity: 1,
    scale: 1,
    zIndex: 21,
  })
  assert.deepEqual(
    getPlaygroundOrbitCardFrame({ baseAngle: 0, orbitRadius: 100, rotation: 0 }),
    {
      x: 0,
      y: -100,
      depth: 0,
      filter: 'brightness(0.82) blur(0px)',
      opacity: 0.58,
      scale: 0.88,
      zIndex: 1,
    },
  )
})

test('orbit animation helpers keep entrance timing and speed easing stable', () => {
  assert.equal(PLAYGROUND_ORBIT_NORMAL_SPEED, 0.018)
  assert.equal(PLAYGROUND_ORBIT_SLOW_SPEED, 0.0035)
  assert.equal(PLAYGROUND_ORBIT_CARD_FULL_FILTER, 'brightness(1) saturate(1) contrast(1) blur(0px)')
  assert.equal(PLAYGROUND_ORBIT_CARD_ACTIVE_FILTER, 'brightness(1.12) saturate(1.08) contrast(1.03) blur(0px)')
  assert.equal(PLAYGROUND_ORBIT_CARD_MUTED_FILTER, 'brightness(0.72) saturate(0.56) blur(5px)')
  assert.equal(PLAYGROUND_ORBIT_CARD_HOVER_SCALE, 1.18)
  assert.equal(PLAYGROUND_ORBIT_CARD_HOVER_Z_INDEX, 40)
  assert.equal(PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DELAY, 0.1)
  assert.equal(PLAYGROUND_MOBILE_MANIFEST_ENTRANCE_DURATION, 0.48)
  assert.equal(PLAYGROUND_ORBIT_CENTER_ENTRANCE_DURATION, 0.48)
  assert.equal(PLAYGROUND_ORBIT_QUICK_SWAP_DURATION, 0.2)
  assert.deepEqual(PLAYGROUND_ORBIT_ENTRANCE, {
    centerDelay: 0.24,
    cardsDelay: 0.38,
    cardStagger: 0.1,
    cardDuration: 0.58,
    ease: MOTION_EASE_SOFT,
  })
  assert.equal(
    getPlaygroundEntranceDurationMs(5, {
      cardsDelay: 0.38,
      cardDuration: 0.58,
      cardStagger: 0.1,
    }),
    1460,
  )
  assert.equal(
    schedulePlaygroundOrbitActivation({
      projectCount: 5,
      scheduleActivation: (delayMs) => `timer:${delayMs}`,
      timing: {
        cardsDelay: 0.38,
        cardDuration: 0.58,
        cardStagger: 0.1,
      },
    }),
    'timer:1460',
  )
  assert.equal(getPlaygroundOrbitCardEntranceDelay(0), 0.38)
  assert.equal(getPlaygroundOrbitCardEntranceDelay(5), 0.88)
  assert.deepEqual(getPlaygroundOrbitCardEntranceTransition(5), {
    delay: 0.88,
    duration: 0.58,
    ease: MOTION_EASE_SOFT,
  })
  assert.deepEqual(getPlaygroundOrbitCardEntranceMotion(), {
    initial: { opacity: 0, scale: 0.8, filter: 'blur(6px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  })
  assert.deepEqual(getPlaygroundVerticalEntranceMotion({ y: 8, blur: 4 }), {
    initial: { opacity: 0, y: 8, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  })
  assert.deepEqual(getPlaygroundVerticalEntranceMotion({ y: 16, blur: 6 }), {
    initial: { opacity: 0, y: 16, filter: 'blur(6px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
  })
  assert.deepEqual(getPlaygroundMobileManifestEntranceTransition(), {
    delay: 0.1,
    duration: 0.48,
    ease: MOTION_EASE_SOFT,
  })
  assert.deepEqual(getPlaygroundOrbitCenterEntranceMotion(), {
    initial: { opacity: 0, scale: 0.96, filter: 'blur(4px)' },
    animate: { opacity: 1, scale: 1, filter: 'blur(0px)' },
  })
  assert.deepEqual(getPlaygroundOrbitCenterEntranceTransition(), {
    delay: 0.24,
    duration: 0.48,
    ease: MOTION_EASE_SOFT,
  })
  assert.deepEqual(getPlaygroundOrbitQuickSwapTransition(), {
    duration: 0.2,
    ease: MOTION_EASE_SOFT,
  })
  assert.deepEqual(getPlaygroundOrbitVerticalSwapMotion({ initialY: -4, exitY: -4 }), {
    initial: { opacity: 0, y: -4, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -4, filter: 'blur(4px)' },
  })
  assert.deepEqual(getPlaygroundOrbitVerticalSwapMotion({ initialY: 5, exitY: -5 }), {
    initial: { opacity: 0, y: 5, filter: 'blur(4px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit: { opacity: 0, y: -5, filter: 'blur(4px)' },
  })
  assert.equal(getPlaygroundOrbitCardHoverScale(false), 1)
  assert.equal(getPlaygroundOrbitCardHoverScale(true), 1.18)
  assert.equal(getPlaygroundOrbitCardZIndex(false, 12), 12)
  assert.equal(getPlaygroundOrbitCardZIndex(true, 12), 40)
  assert.equal(
    getPlaygroundOrbitInteractionFilter({ hasHoverTarget: false, isHovered: false, restFilter: 'resting' }),
    PLAYGROUND_ORBIT_CARD_FULL_FILTER,
  )
  assert.equal(
    getPlaygroundOrbitInteractionFilter({ hasHoverTarget: true, isHovered: false, restFilter: 'resting' }),
    PLAYGROUND_ORBIT_CARD_MUTED_FILTER,
  )
  assert.equal(
    getPlaygroundOrbitInteractionFilter({ hasHoverTarget: true, isHovered: true, restFilter: 'resting' }),
    PLAYGROUND_ORBIT_CARD_ACTIVE_FILTER,
  )
  assert.equal(getPlaygroundOrbitSpeedHoverIndex({ activeIndex: null, hasHoverTarget: false }), null)
  assert.equal(getPlaygroundOrbitSpeedHoverIndex({ activeIndex: 0, hasHoverTarget: false }), null)
  assert.equal(getPlaygroundOrbitSpeedHoverIndex({ activeIndex: 2, hasHoverTarget: true }), 2)
  assert.equal(getPlaygroundOrbitSpeedTarget({ hoveredIndex: null, normalSpeed: 0.018, orbitActive: false, slowSpeed: 0.0035 }), 0)
  assert.equal(getPlaygroundOrbitSpeedTarget({ hoveredIndex: null, normalSpeed: 0.018, orbitActive: true, slowSpeed: 0.0035 }), 0.018)
  assert.equal(getPlaygroundOrbitSpeedTarget({ hoveredIndex: 2, normalSpeed: 0.018, orbitActive: true, slowSpeed: 0.0035 }), 0.0035)
  assert.deepEqual(
    getNextPlaygroundOrbitStep({
      currentRotation: 10,
      currentSpeed: 0,
      smoothing: 0.5,
      targetSpeed: 0.02,
    }),
    { rotation: 10.01, speed: 0.01 },
  )
  assert.deepEqual(
    getNextPlaygroundOrbitStep({
      currentRotation: 359.99,
      currentSpeed: 0.01,
      smoothing: 1,
      targetSpeed: 0.02,
    }),
    { rotation: 0.009999999999990905, speed: 0.02 },
  )
  assert.deepEqual(
    getNextPlaygroundOrbitAnimationFrame({
      currentRotation: 10,
      currentSpeed: 0,
      normalSpeed: 0.018,
      orbitActive: true,
      selection: { activeIndex: 0, hasHoverTarget: false },
      slowSpeed: 0.0035,
      smoothing: 1,
    }),
    { rotation: 10.018, speed: 0.018 },
  )
  assert.deepEqual(
    getNextPlaygroundOrbitAnimationFrame({
      currentRotation: 10,
      currentSpeed: 0,
      normalSpeed: 0.018,
      orbitActive: true,
      selection: { activeIndex: 2, hasHoverTarget: true },
      slowSpeed: 0.0035,
      smoothing: 1,
    }),
    { rotation: 10.0035, speed: 0.0035 },
  )
  assert.deepEqual(
    getNextPlaygroundOrbitAnimationFrame({
      currentRotation: 10,
      currentSpeed: 0.01,
      normalSpeed: 0.018,
      orbitActive: false,
      selection: { activeIndex: 2, hasHoverTarget: true },
      slowSpeed: 0.0035,
      smoothing: 1,
    }),
    { rotation: 10, speed: 0 },
  )
})

test('orbit interaction filter restores full color when hover clears', () => {
  assert.equal(
    getPlaygroundOrbitInteractionFilter({
      hasHoverTarget: true,
      isHovered: false,
      restFilter: 'brightness(0.82) blur(0px)',
    }),
    PLAYGROUND_ORBIT_CARD_MUTED_FILTER,
  )
  assert.equal(
    getPlaygroundOrbitInteractionFilter({
      hasHoverTarget: true,
      isHovered: true,
      restFilter: 'brightness(0.82) blur(0px)',
    }),
    PLAYGROUND_ORBIT_CARD_ACTIVE_FILTER,
  )
  assert.equal(
    getPlaygroundOrbitInteractionFilter({
      hasHoverTarget: false,
      isHovered: false,
      restFilter: 'brightness(0.82) blur(0px)',
    }),
    PLAYGROUND_ORBIT_CARD_FULL_FILTER,
  )
})
