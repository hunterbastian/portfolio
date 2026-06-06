import type { ComponentType, SVGProps } from 'react'
import * as Glyphs from './glyphs'
import {
  SECTION_MARKER_GLYPH_SIZE,
  categoryToSectionMarkerKind,
  getSectionMarkerClassName,
  shouldRenderSectionMarkerLabel,
  type SectionMarkerKind,
} from '@/lib/section-marker'

export type Kind = SectionMarkerKind
type GlyphComponent = ComponentType<SVGProps<SVGSVGElement> & { size?: number }>

type Props = {
  kind: Kind
  label?: string
  className?: string
}

const GLYPHS: Record<Kind, GlyphComponent> = {
  work: Glyphs.Work,
  writing: Glyphs.Writing,
  games: Glyphs.Games,
  contact: Glyphs.Contact,
  archive: Glyphs.Archive,
  now: Glyphs.Now,
  spring: Glyphs.Spring,
  summer: Glyphs.Summer,
  autumn: Glyphs.Autumn,
  winter: Glyphs.Winter,
}

export const categoryToKind = categoryToSectionMarkerKind

export default function SectionMarker({ kind, label, className }: Props) {
  const Glyph = GLYPHS[kind]
  return (
    <span
      className={getSectionMarkerClassName(className)}
    >
      <Glyph size={SECTION_MARKER_GLYPH_SIZE} />
      {shouldRenderSectionMarkerLabel(label) ? <span>{label}</span> : null}
    </span>
  )
}
