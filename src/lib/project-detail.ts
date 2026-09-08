import { resolveSiteUrl, siteConfig, sitePortfolioName } from './site.ts'
import type { ProjectFrontmatter } from '@/types/project'

interface ProjectStructuredDataConfig {
  personName: string
  url: string
}

interface ProjectMetadataSiteConfig {
  personName: string
}

export const PROJECT_DETAIL_TIMING = {
  headerAppear: 60,
  imageAppear: 160,
  metaAppear: 280,
  contentAppear: 400,
  duration: 500,
} as const

export const PROJECT_DETAIL_INITIAL_STAGE = 0
export const PROJECT_DETAIL_FINAL_STAGE = 4

export const PROJECT_DETAIL_REVEAL_STEPS = [
  { stage: 1, delay: PROJECT_DETAIL_TIMING.headerAppear },
  { stage: 2, delay: PROJECT_DETAIL_TIMING.imageAppear },
  { stage: 3, delay: PROJECT_DETAIL_TIMING.metaAppear },
  { stage: PROJECT_DETAIL_FINAL_STAGE, delay: PROJECT_DETAIL_TIMING.contentAppear },
] as const

export const PROJECT_DETAIL_ITEM_MOTION = {
  initialOpacity: 0,
  finalOpacity: 1,
  initialY: 12,
  finalY: 0,
} as const

export const PROJECT_DETAIL_HERO_INITIAL_Y = 16

export interface ProjectDetailTransitionRect {
  height: number
  left: number
  top: number
  width: number
}

export interface ProjectDetailViewActivationInput {
  projectTitle?: string
  slug?: string
  trackProjectView: (slug: string, title: string) => void
}

export interface ProjectDetailTransitionTargetActivationInput {
  getHeroRect: () => ProjectDetailTransitionRect
  pageTransitionYOffset: number
  setTransitionTarget: (target: ProjectDetailTransitionRect) => void
}

export interface ProjectDetailRevealScheduleInput<TTimer> {
  prefersReducedMotion: boolean
  scheduleStage: (stage: number, delay: number) => TTimer
  setStage: (stage: number) => void
}

export const PROJECT_DETAIL_LINK_CLASS =
  'group inline-flex items-center gap-2 font-inter text-[13px] font-medium text-primary transition-[color,transform] duration-300 ease-soft hover:text-accent hover:-translate-y-[2px]'

export type ProjectDetailLinkKind = 'demo' | 'figjam' | 'github'

export interface ProjectDetailLinkItem {
  href: string
  kind: ProjectDetailLinkKind
  label: string
  platform: ProjectDetailLinkKind
}

export function resolveProjectImageUrl(image: string): string {
  return image.startsWith('/') ? resolveSiteUrl(image) : image
}

export function getProjectDetailItemMotion({
  initialY = PROJECT_DETAIL_ITEM_MOTION.initialY,
  stage,
  transitionActive = false,
  visibleStage,
}: {
  initialY?: number
  stage: number
  transitionActive?: boolean
  visibleStage: number
}) {
  if (transitionActive) {
    return { opacity: PROJECT_DETAIL_ITEM_MOTION.initialOpacity, y: PROJECT_DETAIL_ITEM_MOTION.finalY }
  }

  const visible = stage >= visibleStage

  return {
    opacity: visible ? PROJECT_DETAIL_ITEM_MOTION.finalOpacity : PROJECT_DETAIL_ITEM_MOTION.initialOpacity,
    y: visible ? PROJECT_DETAIL_ITEM_MOTION.finalY : initialY,
  }
}

export function getProjectDetailTransitionTarget(
  rect: ProjectDetailTransitionRect,
  pageTransitionYOffset: number,
): ProjectDetailTransitionRect {
  return {
    top: rect.top - pageTransitionYOffset,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}

export function activateProjectDetailView({
  projectTitle,
  slug,
  trackProjectView,
}: ProjectDetailViewActivationInput) {
  if (!slug || !projectTitle) {
    return
  }

  trackProjectView(slug, projectTitle)
}

export function activateProjectDetailTransitionTarget({
  getHeroRect,
  pageTransitionYOffset,
  setTransitionTarget,
}: ProjectDetailTransitionTargetActivationInput) {
  setTransitionTarget(getProjectDetailTransitionTarget(getHeroRect(), pageTransitionYOffset))
}

export function scheduleProjectDetailRevealStages<TTimer>({
  prefersReducedMotion,
  scheduleStage,
  setStage,
}: ProjectDetailRevealScheduleInput<TTimer>): TTimer[] {
  if (prefersReducedMotion) {
    setStage(PROJECT_DETAIL_FINAL_STAGE)
    return []
  }

  setStage(PROJECT_DETAIL_INITIAL_STAGE)
  return PROJECT_DETAIL_REVEAL_STEPS.map(({ delay, stage }) => scheduleStage(stage, delay))
}

export function formatProjectDate(dateValue?: string): string {
  if (!dateValue) {
    return ''
  }

  const parsedDate = new Date(dateValue)
  if (Number.isNaN(parsedDate.getTime())) {
    return dateValue
  }

  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    year: 'numeric',
  }).format(parsedDate)
}

export function getProjectDetailDisplayTitle(frontmatter: Pick<ProjectFrontmatter, 'displayTitle' | 'title'>): string {
  return frontmatter.displayTitle ?? frontmatter.title
}

export function getProjectDetailBreadcrumb({
  isPlayground,
}: {
  isPlayground: boolean
}) {
  return {
    currentLabel: 'Projects',
    href: isPlayground ? '/archive' : '/',
    parentLabel: isPlayground ? 'Playground' : 'Home',
  }
}

export function getProjectDetailLinks(
  frontmatter: Pick<ProjectFrontmatter, 'demo' | 'figjam' | 'github'>,
): ProjectDetailLinkItem[] {
  const links: ProjectDetailLinkItem[] = []

  if (frontmatter.github) {
    links.push({
      href: frontmatter.github,
      kind: 'github',
      label: 'View on GitHub',
      platform: 'github',
    })
  }

  if (frontmatter.demo) {
    links.push({
      href: frontmatter.demo,
      kind: 'demo',
      label: 'Live Demo',
      platform: 'demo',
    })
  }

  if (frontmatter.figjam) {
    links.push({
      href: frontmatter.figjam,
      kind: 'figjam',
      label: 'View Slides',
      platform: 'figjam',
    })
  }

  return links
}

export function getProjectPageMetadata({
  frontmatter,
  portfolioName = sitePortfolioName,
  site = siteConfig,
  slug,
}: {
  frontmatter: ProjectFrontmatter
  portfolioName?: string
  site?: ProjectMetadataSiteConfig
  slug: string
}) {
  const { title, description, image, category, tags, date } = frontmatter
  const imageUrl = resolveProjectImageUrl(image)
  const projectUrl = resolveSiteUrl(`/projects/${slug}`)

  return {
    title: `${title} | ${portfolioName}`,
    description,
    keywords: [title, category, ...(tags || []), site.personName, 'portfolio', 'case study'],
    openGraph: {
      type: 'article',
      title: `${title} - Case Study`,
      description,
      url: projectUrl,
      siteName: portfolioName,
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      publishedTime: date,
      authors: [site.personName],
      tags,
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
    alternates: {
      canonical: projectUrl,
    },
  }
}

export function getProjectStructuredData({
  frontmatter,
  imageUrl,
  projectUrl,
  site = siteConfig,
}: {
  frontmatter: ProjectFrontmatter
  imageUrl: string
  projectUrl: string
  site?: ProjectStructuredDataConfig
}) {
  return [
    {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: frontmatter.title,
      description: frontmatter.description,
      image: imageUrl,
      datePublished: frontmatter.date,
      dateModified: frontmatter.date,
      author: {
        '@type': 'Person',
        name: site.personName,
        url: site.url,
      },
      publisher: {
        '@type': 'Person',
        name: site.personName,
      },
      mainEntityOfPage: {
        '@type': 'WebPage',
        '@id': projectUrl,
      },
      keywords: frontmatter.tags?.join(', '),
      articleSection: frontmatter.category,
    },
    {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: site.url },
        { '@type': 'ListItem', position: 2, name: 'Projects', item: resolveSiteUrl('/#case-studies') },
        { '@type': 'ListItem', position: 3, name: frontmatter.title, item: projectUrl },
      ],
    },
  ]
}
