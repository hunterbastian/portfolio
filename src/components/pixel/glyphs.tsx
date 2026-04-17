import type { SVGProps, ReactNode } from 'react'
import styles from './pixel.module.css'

type GlyphProps = SVGProps<SVGSVGElement> & { size?: number }

function Base({
  size = 12,
  className,
  children,
  ...rest
}: GlyphProps & { children: ReactNode }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 8 8"
      className={[styles.crisp, className].filter(Boolean).join(' ')}
      fill="currentColor"
      aria-hidden="true"
      {...rest}
    >
      {children}
    </svg>
  )
}

export const Work = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="1" y="1" width="6" height="4" />
    <rect x="2" y="2" width="4" height="2" fill="var(--background)" />
    <rect x="3" y="6" width="2" height="1" />
    <rect x="2" y="7" width="4" height="1" />
  </Base>
)

export const Writing = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="1" y="0" width="5" height="8" />
    <rect x="2" y="2" width="3" height="1" fill="var(--background)" />
    <rect x="2" y="4" width="3" height="1" fill="var(--background)" />
    <rect x="2" y="6" width="2" height="1" fill="var(--background)" />
  </Base>
)

export const Games = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="0" y="3" width="8" height="3" />
    <rect x="1" y="2" width="2" height="1" />
    <rect x="5" y="2" width="2" height="1" />
    <rect x="2" y="4" width="1" height="1" fill="var(--background)" />
    <rect x="5" y="4" width="1" height="1" fill="var(--background)" />
  </Base>
)

export const Contact = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="0" y="2" width="8" height="5" />
    <rect x="1" y="3" width="6" height="1" fill="var(--background)" />
    <rect x="2" y="4" width="4" height="1" fill="var(--background)" />
  </Base>
)

export const Archive = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="0" y="1" width="8" height="2" />
    <rect x="1" y="3" width="6" height="5" />
    <rect x="3" y="4" width="2" height="1" fill="var(--background)" />
  </Base>
)

export const Now = (p: GlyphProps) => (
  <Base {...p}>
    <rect x="3" y="3" width="2" height="2" />
  </Base>
)
