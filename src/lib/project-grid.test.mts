import assert from 'node:assert/strict'
import { test } from 'node:test'
import {
  PROJECT_GRID_CARDS_STAGE,
  PROJECT_GRID_CARD_SLOT_CLASS_NAME,
  PROJECT_GRID_FLAT_TRANSFORM,
  PROJECT_GRID_INITIAL_STAGE,
  PROJECT_GRID_PANEL_STAGE,
  PROJECT_GRID_REDUCED_MOTION_STAGE,
  getProjectGridCardOpacity,
  getProjectGridCardState,
  getProjectGridCardZIndex,
  getProjectGridLayoutMetrics,
  getProjectGridRevealSteps,
  getProjectGridStaticCardStyle,
  getProjectGridStaticCardTransform,
  getProjectGridViewStateFromOrderedProjects,
  getProjectStackZIndex,
  scheduleProjectGridRevealStages,
  sortCaseStudyProjects,
} from './project-grid.ts'
import type { ProjectGridDialConfig, ProjectGridProject } from './project-grid.ts'

function project(slug: string): ProjectGridProject {
  return {
    slug,
    frontmatter: {
      title: slug,
      description: `${slug} description`,
      category: 'Web Design',
      tags: [],
      image: `/images/${slug}.webp`,
      date: '2026-01-01',
    },
  }
}

const dial: ProjectGridDialConfig = {
  expanded: {
    gapX: 28,
    gapY: 32,
    scale: 1,
  },
  hover: {
    inactiveOpacity: 0.88,
  },
  motion: {
    collapseMs: 550,
    expandMs: 800,
  },
  pile: {
    compactGapX: 18,
    compactGapY: 22,
    compactScale: 0.985,
    stackPriority: 'default',
  },
}

test('sortCaseStudyProjects follows preferred order and preserves unknown relative order', () => {
  const projects = [
    project('custom-a'),
    project('porsche-app'),
    project('lumo'),
    project('custom-b'),
    project('wander-utah'),
  ]

  assert.deepEqual(
    sortCaseStudyProjects(projects).map((item) => item.slug),
    ['lumo', 'wander-utah', 'porsche-app', 'custom-a', 'custom-b'],
  )
})

test('getProjectStackZIndex handles all stack priority modes', () => {
  assert.equal(getProjectStackZIndex(0, 5, 'default'), 1)
  assert.equal(getProjectStackZIndex(2, 5, 'center'), 5)
  assert.equal(getProjectStackZIndex(0, 5, 'left'), 5)
  assert.equal(getProjectStackZIndex(4, 5, 'right'), 5)
})

test('project grid layout metrics preserve expanded and compact dial values', () => {
  assert.deepEqual(getProjectGridLayoutMetrics(true, dial), {
    gridColumnGap: 28,
    gridRowGap: 32,
    layoutTransitionDuration: 800,
    targetScale: 1,
  })
  assert.deepEqual(getProjectGridLayoutMetrics(false, dial), {
    gridColumnGap: 18,
    gridRowGap: 22,
    layoutTransitionDuration: 550,
    targetScale: 0.985,
  })
})

test('project grid hover helpers preserve opacity and z-index behavior', () => {
  assert.equal(getProjectGridCardOpacity({ hoveredIndex: null, inactiveOpacity: 0.88, index: 2, supportsHover: true }), 1)
  assert.equal(getProjectGridCardOpacity({ hoveredIndex: 2, inactiveOpacity: 0.88, index: 2, supportsHover: true }), 1)
  assert.equal(getProjectGridCardOpacity({ hoveredIndex: 1, inactiveOpacity: 0.88, index: 2, supportsHover: true }), 0.88)
  assert.equal(getProjectGridCardOpacity({ hoveredIndex: 1, inactiveOpacity: 0.88, index: 2, supportsHover: false }), 1)
  assert.equal(getProjectGridCardZIndex(false, 5, 3), 3)
  assert.equal(getProjectGridCardZIndex(true, 5, 3), 25)
})

test('project grid static card helpers preserve slot presentation values', () => {
  assert.equal(
    PROJECT_GRID_CARD_SLOT_CLASS_NAME,
    'w-full transition-[transform,opacity] duration-[550ms] ease-soft',
  )
  assert.equal(PROJECT_GRID_INITIAL_STAGE, 0)
  assert.equal(PROJECT_GRID_PANEL_STAGE, 1)
  assert.equal(PROJECT_GRID_CARDS_STAGE, 2)
  assert.equal(PROJECT_GRID_REDUCED_MOTION_STAGE, PROJECT_GRID_CARDS_STAGE)
  assert.deepEqual(PROJECT_GRID_FLAT_TRANSFORM, {
    x: 0,
    rotate: 0,
  })
  assert.equal(getProjectGridStaticCardTransform(0.985), 'translateX(0px) rotate(0deg) scale(0.985)')
  assert.equal(
    getProjectGridStaticCardTransform(1, {
      x: 12,
      rotate: -2,
    }),
    'translateX(12px) rotate(-2deg) scale(1)',
  )
  assert.deepEqual(getProjectGridStaticCardStyle({ cardOpacity: 0.88, targetScale: 0.985, zIndex: 7 }), {
    zIndex: 7,
    opacity: 0.88,
    transform: 'translateX(0px) rotate(0deg) scale(0.985)',
  })
})

test('project grid reveal steps preserve staged entrance timing and completion marker', () => {
  assert.deepEqual(
    getProjectGridRevealSteps(40, {
      cardsAppear: 220,
      panelAppear: 90,
    }),
    [
      {
        completesEntrance: false,
        delay: 130,
        stage: PROJECT_GRID_PANEL_STAGE,
      },
      {
        completesEntrance: true,
        delay: 260,
        stage: PROJECT_GRID_CARDS_STAGE,
      },
    ],
  )
})

test('scheduleProjectGridRevealStages maps visibility and motion states to reveal timers', () => {
  const hiddenCalls: unknown[] = []
  const hiddenTimers = scheduleProjectGridRevealStages({
    hasPlayedEntrance: false,
    initialLoadDelayMs: 40,
    isGridInView: false,
    prefersReducedMotion: false,
    scheduleStage: (step) => {
      hiddenCalls.push(['schedule', step])
      return step.delay
    },
    setHasPlayedEntrance: (hasPlayed) => hiddenCalls.push(['played', hasPlayed]),
    setStage: (stage) => hiddenCalls.push(['stage', stage]),
    timing: {
      cardsAppear: 220,
      panelAppear: 90,
    },
  })

  assert.deepEqual(hiddenCalls, [['stage', PROJECT_GRID_INITIAL_STAGE]])
  assert.deepEqual(hiddenTimers, [])

  const reducedCalls: unknown[] = []
  const reducedTimers = scheduleProjectGridRevealStages({
    hasPlayedEntrance: false,
    initialLoadDelayMs: 40,
    isGridInView: true,
    prefersReducedMotion: true,
    scheduleStage: (step) => {
      reducedCalls.push(['schedule', step])
      return step.delay
    },
    setHasPlayedEntrance: (hasPlayed) => reducedCalls.push(['played', hasPlayed]),
    setStage: (stage) => reducedCalls.push(['stage', stage]),
    timing: {
      cardsAppear: 220,
      panelAppear: 90,
    },
  })

  assert.deepEqual(reducedCalls, [
    ['stage', PROJECT_GRID_REDUCED_MOTION_STAGE],
    ['played', true],
  ])
  assert.deepEqual(reducedTimers, [])

  const stagedCalls: unknown[] = []
  const stagedTimers = scheduleProjectGridRevealStages({
    hasPlayedEntrance: false,
    initialLoadDelayMs: 40,
    isGridInView: true,
    prefersReducedMotion: false,
    scheduleStage: (step) => {
      stagedCalls.push(['schedule', step.stage, step.delay, step.completesEntrance])
      return `${step.stage}:${step.delay}:${step.completesEntrance}`
    },
    setHasPlayedEntrance: (hasPlayed) => stagedCalls.push(['played', hasPlayed]),
    setStage: (stage) => stagedCalls.push(['stage', stage]),
    timing: {
      cardsAppear: 220,
      panelAppear: 90,
    },
  })

  assert.deepEqual(stagedCalls, [
    ['stage', PROJECT_GRID_INITIAL_STAGE],
    ['schedule', PROJECT_GRID_PANEL_STAGE, 130, false],
    ['schedule', PROJECT_GRID_CARDS_STAGE, 260, true],
  ])
  assert.deepEqual(stagedTimers, [
    `${PROJECT_GRID_PANEL_STAGE}:130:false`,
    `${PROJECT_GRID_CARDS_STAGE}:260:true`,
  ])
})

test('project grid card state packages hover opacity and stack z-index', () => {
  const lumo = project('lumo')

  assert.deepEqual(
    getProjectGridCardState(lumo, 1, 3, {
      dial,
      hoveredIndex: 1,
      supportsHover: true,
    }),
    {
      cardOpacity: 1,
      index: 1,
      isHovered: true,
      project: lumo,
      stackZIndex: 2,
    },
  )
  assert.deepEqual(
    getProjectGridCardState(lumo, 1, 3, {
      dial,
      hoveredIndex: 0,
      supportsHover: true,
    }),
    {
      cardOpacity: 0.88,
      index: 1,
      isHovered: false,
      project: lumo,
      stackZIndex: 2,
    },
  )
})

test('project grid view state packages layout and card states', () => {
  const orderedProjects = [
    project('lumo'),
    project('wander-utah'),
    project('porsche-app'),
  ]

  const viewState = getProjectGridViewStateFromOrderedProjects(orderedProjects, {
    dial,
    hoveredIndex: 1,
    isExpandedLayout: true,
    supportsHover: true,
  })

  assert.deepEqual(viewState.layoutMetrics, {
    gridColumnGap: 28,
    gridRowGap: 32,
    layoutTransitionDuration: 800,
    targetScale: 1,
  })
  assert.equal(viewState.totalProjects, 3)
  assert.deepEqual(
    viewState.cardStates.map(({ cardOpacity, index, isHovered, project, stackZIndex }) => ({
      cardOpacity,
      index,
      isHovered,
      slug: project.slug,
      stackZIndex,
    })),
    [
      { cardOpacity: 0.88, index: 0, isHovered: false, slug: 'lumo', stackZIndex: 1 },
      { cardOpacity: 1, index: 1, isHovered: true, slug: 'wander-utah', stackZIndex: 2 },
      { cardOpacity: 0.88, index: 2, isHovered: false, slug: 'porsche-app', stackZIndex: 3 },
    ],
  )
})
