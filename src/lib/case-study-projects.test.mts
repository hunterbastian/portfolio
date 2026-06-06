import assert from 'node:assert/strict'
import { test } from 'node:test'
import { MOTION_EASE_SOFT } from './motion.ts'
import {
  CASE_STUDY_TEXT_LIST_ITEM_ANIMATE,
  CASE_STUDY_TEXT_LIST_ITEM_INITIAL,
  CASE_STUDY_TEXT_LIST_CATEGORY_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_CONTAINER_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_DOT_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_DOT_LAYOUT_ID,
  CASE_STUDY_TEXT_LIST_LIST_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_PREVIEW_ANIMATE,
  CASE_STUDY_TEXT_LIST_PREVIEW_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_PREVIEW_EXIT,
  CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_HEIGHT,
  CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_WIDTH,
  CASE_STUDY_TEXT_LIST_PREVIEW_INITIAL,
  CASE_STUDY_TEXT_LIST_PREVIEW_SIZES,
  CASE_STUDY_TEXT_LIST_PREVIEW_WIDTH,
  CASE_STUDY_TEXT_LIST_ROW_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_ROW_CONTENT_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_SPRING,
  activateCaseStudyTextListHoverEnd,
  activateCaseStudyTextListHoverStart,
  activateCaseStudyTextListRow,
  getCaseStudyProjectHref,
  getCaseStudyProjectTitle,
  getCaseStudyTextListPreviewState,
  getCaseStudyTextListItemTransition,
  getCaseStudyTextListMousePosition,
  getCaseStudyTextListPreviewStyle,
  getCaseStudyTextListPreviewTransition,
  getCaseStudyTextListRowState,
  getCaseStudyTextListRowStyle,
  getCaseStudyTextListTitleClassName,
  getCaseStudyTextListViewState,
  getCaseStudyTextListViewStateFromOrderedProjects,
  getHoveredCaseStudyProject,
  sortCaseStudyProjects,
  type CaseStudyProject,
} from './case-study-projects.ts'

function project(slug: string, displayTitle?: string): CaseStudyProject {
  return {
    slug,
    frontmatter: {
      title: `${slug} title`,
      displayTitle,
      description: `${slug} description`,
      category: 'Web Design',
      tags: [],
      image: `/images/${slug}.webp`,
      date: '2026-01-01',
    },
  }
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

test('case study display helpers keep text list routes and titles stable', () => {
  const withDisplayTitle = project('lumo', 'Lumo')
  const withoutDisplayTitle = project('wander-utah')

  assert.equal(getCaseStudyProjectTitle(withDisplayTitle), 'Lumo')
  assert.equal(getCaseStudyProjectTitle(withoutDisplayTitle), 'wander-utah title')
  assert.equal(getCaseStudyProjectHref(withDisplayTitle), '/projects/lumo')
})

test('activateCaseStudyTextListRow tracks project click before navigating', () => {
  const lumo = project('lumo', 'Lumo')
  const calls: unknown[] = []

  activateCaseStudyTextListRow({
    href: '/projects/lumo',
    navigateTo: (href) => calls.push(['navigate', href]),
    project: lumo,
    title: 'Lumo',
    trackProjectClick: (slug, title) => calls.push(['project', slug, title]),
  })

  assert.deepEqual(calls, [
    ['project', 'lumo', 'Lumo'],
    ['navigate', '/projects/lumo'],
  ])
})

test('case study text list hover activations set and clear hovered slug', () => {
  const calls: Array<string | null> = []

  activateCaseStudyTextListHoverStart({
    projectSlug: 'wander-utah',
    setHoveredSlug: (slug) => calls.push(slug),
  })
  activateCaseStudyTextListHoverEnd({
    setHoveredSlug: (slug) => calls.push(slug),
  })

  assert.deepEqual(calls, ['wander-utah', null])
})

test('getHoveredCaseStudyProject resolves selected project without fallback guesses', () => {
  const projects = [project('lumo'), project('wander-utah')]

  assert.equal(getHoveredCaseStudyProject(projects, null), null)
  assert.equal(getHoveredCaseStudyProject(projects, 'missing'), null)
  assert.equal(getHoveredCaseStudyProject(projects, 'wander-utah')?.slug, 'wander-utah')
})

test('case study text list hover helpers preserve row fade, cursor, and title classes', () => {
  assert.deepEqual(getCaseStudyTextListMousePosition(100, 240), { x: 124, y: 160 })
  assert.deepEqual(getCaseStudyTextListRowStyle(false, false), { opacity: 1, filter: 'none' })
  assert.deepEqual(getCaseStudyTextListRowStyle(true, true), { opacity: 1, filter: 'none' })
  assert.deepEqual(getCaseStudyTextListRowStyle(true, false), { opacity: 0.35, filter: 'blur(1px)' })
  assert.equal(
    getCaseStudyTextListTitleClassName(true),
    'font-mono text-[13px] tracking-[0.04em] transition-colors duration-300 sm:text-[14px] text-foreground',
  )
  assert.equal(
    getCaseStudyTextListTitleClassName(false),
    'font-mono text-[13px] tracking-[0.04em] transition-colors duration-300 sm:text-[14px] text-foreground/70',
  )
})

test('case study text list row state packages hover display data', () => {
  const lumo = project('lumo', 'Lumo')
  const inactive = getCaseStudyTextListRowState(lumo, 0, 'wander-utah')
  const active = getCaseStudyTextListRowState(lumo, 0, 'lumo')

  assert.deepEqual(inactive, {
    category: 'Web Design',
    href: '/projects/lumo',
    index: 0,
    isHovered: false,
    project: lumo,
    rowStyle: { opacity: 0.35, filter: 'blur(1px)' },
    title: 'Lumo',
    titleClassName:
      'font-mono text-[13px] tracking-[0.04em] transition-colors duration-300 sm:text-[14px] text-foreground/70',
  })
  assert.deepEqual(active, {
    category: 'Web Design',
    href: '/projects/lumo',
    index: 0,
    isHovered: true,
    project: lumo,
    rowStyle: { opacity: 1, filter: 'none' },
    title: 'Lumo',
    titleClassName:
      'font-mono text-[13px] tracking-[0.04em] transition-colors duration-300 sm:text-[14px] text-foreground',
  })
})

test('case study text list view state resolves order, rows, and preview project', () => {
  const projects = [
    project('custom-a'),
    project('porsche-app'),
    project('lumo', 'Lumo'),
    project('wander-utah'),
  ]
  const viewState = getCaseStudyTextListViewState(projects, 'porsche-app')

  assert.deepEqual(
    viewState.orderedProjects.map((item) => item.slug),
    ['lumo', 'wander-utah', 'porsche-app', 'custom-a'],
  )
  assert.equal(viewState.hoveredProject?.slug, 'porsche-app')
  assert.deepEqual(
    viewState.rows.map((row) => ({
      href: row.href,
      index: row.index,
      isHovered: row.isHovered,
      slug: row.project.slug,
      title: row.title,
    })),
    [
      { href: '/projects/lumo', index: 0, isHovered: false, slug: 'lumo', title: 'Lumo' },
      { href: '/projects/wander-utah', index: 1, isHovered: false, slug: 'wander-utah', title: 'wander-utah title' },
      { href: '/projects/porsche-app', index: 2, isHovered: true, slug: 'porsche-app', title: 'porsche-app title' },
      { href: '/projects/custom-a', index: 3, isHovered: false, slug: 'custom-a', title: 'custom-a title' },
    ],
  )

  const orderedProjects = sortCaseStudyProjects(projects)
  const orderedViewState = getCaseStudyTextListViewStateFromOrderedProjects(orderedProjects, null)

  assert.equal(orderedViewState.hoveredProject, null)
  assert.equal(orderedViewState.preview, null)
  assert.equal(orderedViewState.orderedProjects, orderedProjects)
  assert.equal(orderedViewState.rows.every((row) => row.rowStyle.opacity === 1), true)
})

test('case study text list preview state resolves image and alt text', () => {
  const lumo = project('lumo', 'Lumo')
  const noImage = project('wander-utah')
  noImage.frontmatter.image = ''

  assert.deepEqual(getCaseStudyTextListPreviewState(lumo), {
    alt: 'Lumo',
    image: '/images/lumo.webp',
  })
  assert.equal(getCaseStudyTextListPreviewState(noImage), null)
  assert.equal(getCaseStudyTextListPreviewState(null), null)
  assert.deepEqual(getCaseStudyTextListViewState([lumo], 'lumo').preview, {
    alt: 'Lumo',
    image: '/images/lumo.webp',
  })
})

test('case study text list motion helpers preserve entrance and preview contracts', () => {
  assert.deepEqual(CASE_STUDY_TEXT_LIST_SPRING, { stiffness: 300, damping: 30 })
  assert.deepEqual(CASE_STUDY_TEXT_LIST_ITEM_INITIAL, { opacity: 0, y: 8 })
  assert.deepEqual(CASE_STUDY_TEXT_LIST_ITEM_ANIMATE, { opacity: 1, y: 0 })
  assert.deepEqual(getCaseStudyTextListItemTransition(3), {
    duration: 0.4,
    delay: 0.18,
    ease: MOTION_EASE_SOFT,
  })
  assert.equal(CASE_STUDY_TEXT_LIST_PREVIEW_WIDTH, 280)
  assert.equal(CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_WIDTH, 560)
  assert.equal(CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_HEIGHT, 315)
  assert.equal(CASE_STUDY_TEXT_LIST_PREVIEW_SIZES, '280px')
  assert.deepEqual(CASE_STUDY_TEXT_LIST_PREVIEW_INITIAL, { opacity: 0, scale: 0.9 })
  assert.deepEqual(CASE_STUDY_TEXT_LIST_PREVIEW_ANIMATE, { opacity: 1, scale: 1 })
  assert.deepEqual(CASE_STUDY_TEXT_LIST_PREVIEW_EXIT, { opacity: 0, scale: 0.95 })
  assert.deepEqual(getCaseStudyTextListPreviewTransition(), {
    opacity: { duration: 0.25, ease: MOTION_EASE_SOFT },
    scale: { duration: 0.35, ease: MOTION_EASE_SOFT },
  })
})

test('case study text list chrome helpers preserve row and preview classes', () => {
  assert.equal(CASE_STUDY_TEXT_LIST_CONTAINER_CLASS_NAME, 'relative')
  assert.equal(CASE_STUDY_TEXT_LIST_LIST_CLASS_NAME, 'border-t border-border')
  assert.match(CASE_STUDY_TEXT_LIST_ROW_CLASS_NAME, /transition-\[color,opacity,filter\]/)
  assert.match(CASE_STUDY_TEXT_LIST_ROW_CLASS_NAME, /focus-visible:outline-primary/)
  assert.equal(CASE_STUDY_TEXT_LIST_ROW_CONTENT_CLASS_NAME, 'flex items-center gap-3')
  assert.equal(CASE_STUDY_TEXT_LIST_DOT_CLASS_NAME, 'w-[4px] h-[4px] rounded-full bg-accent shrink-0')
  assert.equal(CASE_STUDY_TEXT_LIST_DOT_LAYOUT_ID, 'project-dot')
  assert.match(CASE_STUDY_TEXT_LIST_CATEGORY_CLASS_NAME, /uppercase/)
  assert.match(CASE_STUDY_TEXT_LIST_CATEGORY_CLASS_NAME, /shrink-0/)
  assert.equal(CASE_STUDY_TEXT_LIST_PREVIEW_CLASS_NAME, 'pointer-events-none fixed z-50 overflow-hidden shadow-lg')
  assert.equal(CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_CLASS_NAME, 'h-auto w-full object-cover')
  assert.deepEqual(getCaseStudyTextListPreviewStyle('x', 'y'), {
    x: 'x',
    y: 'y',
    width: CASE_STUDY_TEXT_LIST_PREVIEW_WIDTH,
  })
})
