export type SectionMarkerKind =
  | 'work'
  | 'writing'
  | 'games'
  | 'contact'
  | 'archive'
  | 'now'
  | 'spring'
  | 'summer'
  | 'autumn'
  | 'winter'

export const SECTION_MARKER_BASE_CLASS_NAME =
  'inline-flex items-center gap-2 font-mono text-[10px] font-normal tracking-[0.06em] uppercase text-muted-foreground/55'
export const SECTION_MARKER_GLYPH_SIZE = 9
export const SECTION_MARKER_DEFAULT_KIND: SectionMarkerKind = 'work'

export function getSectionMarkerClassName(className?: string) {
  return [SECTION_MARKER_BASE_CLASS_NAME, className].filter(Boolean).join(' ')
}

export function shouldRenderSectionMarkerLabel(label?: string) {
  return Boolean(label)
}

export function categoryToSectionMarkerKind(category?: string): SectionMarkerKind {
  if (!category) return SECTION_MARKER_DEFAULT_KIND

  const normalizedCategory = category.toLowerCase()

  if (normalizedCategory.includes('game') || normalizedCategory.includes('creative cod')) return 'games'
  if (
    normalizedCategory.includes('brand') ||
    normalizedCategory.includes('writing') ||
    normalizedCategory.includes('graphic')
  ) {
    return 'writing'
  }
  if (normalizedCategory.includes('photo')) return 'archive'

  return SECTION_MARKER_DEFAULT_KIND
}
