import type { ComponentType, SVGProps } from 'react'
import * as Glyphs from './glyphs'

type Kind = 'work' | 'writing' | 'games' | 'contact' | 'archive' | 'now'
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
