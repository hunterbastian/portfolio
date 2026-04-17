import type { ComponentType, SVGProps } from 'react'
import * as Glyphs from './glyphs'

export type Kind =
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

export function categoryToKind(category?: string): Kind {
  if (!category) return 'work'
  const c = category.toLowerCase()
  if (c.includes('game') || c.includes('creative cod')) return 'games'
  if (c.includes('brand') || c.includes('writing') || c.includes('graphic')) return 'writing'
  if (c.includes('photo')) return 'archive'
  return 'work'
}

export default function SectionMarker({ kind, label, className }: Props) {
  const Glyph = GLYPHS[kind]
  return (
    <span
      className={[
        'inline-flex items-center gap-2 font-mono text-[10px] font-normal tracking-[0.06em] uppercase text-muted-foreground/55',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      <Glyph size={10} />
      {label ? <span>{label}</span> : null}
    </span>
  )
}
