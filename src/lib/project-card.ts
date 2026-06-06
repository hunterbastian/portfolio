import type { ProjectFrontmatter } from '@/types/project'
import type { TransitionRect } from './project-transition.ts'
import { formatProjectCategoryLabel } from './project-labels.ts'

export const PROJECT_CARD_STAGGER_MS = 80
export const PROJECT_CARD_PLACEHOLDER_SRC = '/images/placeholder.svg'
export const PROJECT_CARD_OPEN_TOAST = 'Opening project'
export const PROJECT_CARD_HAPTIC_STYLE = 'medium'

export interface ProjectCardActionStateInput {
  displayTitle: string
  slug: string
}

export interface ProjectCardActionState {
  analyticsTitle: string
  href: string
  slug: string
  toast: string
}

export interface ProjectCardActivationInput {
  actionState: ProjectCardActionState
  imageSrc: string
  showToast: (message: string) => void
  startTransition: (slug: string, imageSrc: string, rect: TransitionRect) => void
  trackProjectClick: (slug: string, title: string) => void
  transitionRect?: TransitionRect
  triggerHaptic: (style: typeof PROJECT_CARD_HAPTIC_STYLE) => void
}

export interface ProjectCardImagePriorityProps {
  fetchPriority: 'high' | 'low'
  loading: 'eager' | 'lazy'
}

export interface ProjectCardDisplayStateInput {
  frontmatter: ProjectFrontmatter
  hideLiveBadge?: boolean
  index: number
  priorityImage?: boolean
}

export interface ProjectCardDisplayState {
  categoryLabel: string
  demoHref: string | undefined
  displayTitle: string
  imagePriorityProps: ProjectCardImagePriorityProps
  shouldPrioritizeImage: boolean
}

export function getProjectCardTitle(frontmatter: ProjectFrontmatter): string {
  return frontmatter.displayTitle ?? frontmatter.title
}

export function shouldPrioritizeProjectCardImage(index: number, priorityImage?: boolean): boolean {
  return index === 0 || priorityImage === true
}

export function getProjectCardAnimationDelay(index: number): string {
  return `${index * PROJECT_CARD_STAGGER_MS}ms`
}

export function getProjectCardImageAlt(frontmatter: ProjectFrontmatter): string {
  return `Preview of ${frontmatter.title}`
}

export function getProjectCardDemoAriaLabel(displayTitle: string): string {
  return `Live demo for ${displayTitle}`
}

export function getProjectCardHref(slug: string): string {
  return `/projects/${slug}`
}

export function getProjectCardActionState({
  displayTitle,
  slug,
}: ProjectCardActionStateInput): ProjectCardActionState {
  return {
    analyticsTitle: displayTitle,
    href: getProjectCardHref(slug),
    slug,
    toast: PROJECT_CARD_OPEN_TOAST,
  }
}

export function getProjectCardImageFrameClassName(hideLabel?: boolean): string {
  return hideLabel
    ? 'project-card-image-frame project-card-image-frame--square'
    : 'project-card-image-frame project-card-image-frame--wide img-inset-outline'
}

export function getProjectCardImageTransitionClassName(index: number, imageLoaded: boolean): string {
  const transitionClass = index === 0 ? 'transition-[transform,filter]' : 'transition-[transform,opacity,filter]'
  const opacityClass = imageLoaded ? 'opacity-100' : 'opacity-0'

  return `object-cover ${transitionClass} duration-500 ease-soft group-hover:scale-[1.015] group-hover:saturate-[0.96] ${opacityClass}`
}

export function getProjectCardImagePriorityProps(shouldPrioritizeImage: boolean): ProjectCardImagePriorityProps {
  return shouldPrioritizeImage
    ? { loading: 'eager', fetchPriority: 'high' }
    : { loading: 'lazy', fetchPriority: 'low' }
}

export function getProjectCardImageZoomStyle(imageZoom?: number): { transform: string } | undefined {
  return imageZoom ? { transform: `scale(${imageZoom})` } : undefined
}

export function shouldShowProjectCardLiveBadge(demo?: string, hideLiveBadge?: boolean): boolean {
  return Boolean(demo && !hideLiveBadge)
}

export function getProjectCardDisplayState({
  frontmatter,
  hideLiveBadge,
  index,
  priorityImage,
}: ProjectCardDisplayStateInput): ProjectCardDisplayState {
  const displayTitle = getProjectCardTitle(frontmatter)
  const shouldPrioritizeImage = shouldPrioritizeProjectCardImage(index, priorityImage)

  return {
    categoryLabel: formatProjectCategoryLabel(frontmatter.category),
    demoHref: shouldShowProjectCardLiveBadge(frontmatter.demo, hideLiveBadge) ? frontmatter.demo : undefined,
    displayTitle,
    imagePriorityProps: getProjectCardImagePriorityProps(shouldPrioritizeImage),
    shouldPrioritizeImage,
  }
}

export function getProjectCardTransitionRect(rect: TransitionRect): TransitionRect {
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  }
}

export function activateProjectCard({
  actionState,
  imageSrc,
  showToast,
  startTransition,
  trackProjectClick,
  transitionRect,
  triggerHaptic,
}: ProjectCardActivationInput) {
  triggerHaptic(PROJECT_CARD_HAPTIC_STYLE)
  trackProjectClick(actionState.slug, actionState.analyticsTitle)
  showToast(actionState.toast)

  if (transitionRect) {
    startTransition(actionState.slug, imageSrc, transitionRect)
  }
}
