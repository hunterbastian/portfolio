import type { HomeLinkItem } from '@/content/homepage'
import { HOME_ROW_HOVER_ACCENT, getFeaturedProjectRowStyleVars } from './home-projects.ts'
import type { FeaturedProjectRowStyleVars } from './home-projects.ts'

export interface HomeEndeavorHoveredState {
  index: number
  label: string
}

export interface HomeEndeavorRowState {
  active: boolean
  hoverDistance: number
  index: number
  label: string
  muted: boolean
}

export interface HomeEndeavorListState {
  hasHoveredEndeavor: boolean
  rows: HomeEndeavorRowState[]
}

export interface HomeEndeavorThumbnail {
  alt: string
  src: string
}

export type HomeEndeavorRowStyleVars = FeaturedProjectRowStyleVars

const HOME_ENDEAVOR_THUMBNAILS: Record<NonNullable<HomeLinkItem['iconType']>, HomeEndeavorThumbnail> = {
  'studio-alpine': {
    alt: 'Studio Alpine camera icon',
    src: '/images/optimized/endeavors/studio-alpine-camera-object-icon.png',
  },
  'studio-cala': {
    alt: 'Studio Cala design workspace icon',
    src: '/images/optimized/projects/mental-health-computer-object-icon.png',
  },
  handshake: {
    alt: 'Freelance coffee icon',
    src: '/images/optimized/endeavors/freelance-coffee-object-icon.png',
  },
}

const HOME_ENDEAVOR_DESCRIPTIONS: Record<string, string> = {
  'Studio Alpine': 'My photography and creator brand.',
  'Studio Cala': 'My web design and design studio.',
  'Available for freelance': 'Design and web work.',
}

const HOME_ENDEAVOR_META: Record<string, string> = {
  'Studio Alpine': 'Photography',
  'Studio Cala': 'Design',
  'Available for freelance': 'Open',
}

export function getHomeEndeavorAccent(_label: string) {
  return HOME_ROW_HOVER_ACCENT
}

export function getHomeEndeavorDescription(label: string) {
  return HOME_ENDEAVOR_DESCRIPTIONS[label] ?? 'A current creative or professional thread.'
}

export function getHomeEndeavorMeta(label: string) {
  return HOME_ENDEAVOR_META[label] ?? 'Now'
}

export function getHomeEndeavorThumbnail(iconType?: HomeLinkItem['iconType']): HomeEndeavorThumbnail | null {
  return iconType ? HOME_ENDEAVOR_THUMBNAILS[iconType] ?? null : null
}

export function getHomeEndeavorRowStyleVars(label: string, hoverDistance = 0): HomeEndeavorRowStyleVars {
  return getFeaturedProjectRowStyleVars(label, hoverDistance, getHomeEndeavorAccent(label))
}

export function getHomeEndeavorHoverDistance(hoveredIndex: number | null, index: number): number {
  return hoveredIndex === null ? 0 : Math.abs(hoveredIndex - index)
}

export function getHomeEndeavorRowState(
  label: string,
  index: number,
  hoveredEndeavor: HomeEndeavorHoveredState | null,
): HomeEndeavorRowState {
  const hasHoveredEndeavor = hoveredEndeavor !== null

  return {
    active: hoveredEndeavor?.label === label,
    hoverDistance: getHomeEndeavorHoverDistance(hoveredEndeavor?.index ?? null, index),
    index,
    label,
    muted: hasHoveredEndeavor && hoveredEndeavor?.label !== label,
  }
}

export function getHomeEndeavorListState(
  links: readonly HomeLinkItem[],
  hoveredEndeavor: HomeEndeavorHoveredState | null,
): HomeEndeavorListState {
  return {
    hasHoveredEndeavor: hoveredEndeavor !== null,
    rows: links.map((link, index) => getHomeEndeavorRowState(link.label, index, hoveredEndeavor)),
  }
}
