import type { FC, SVGProps } from 'react'

export type CentralIconName =
  | 'IconInstagram'
  | 'IconLinkedin'
  | 'IconX'
  | 'IconGithub'
  | 'IconDribbble'
  | 'IconFileText'
  | 'IconCamera1'

export type CentralIconCategory = 'social' | 'document' | 'media'
export type CentralIconFill = 'filled' | 'outline' | string
export type CentralIconJoin = 'round' | 'bevel' | 'miter' | string
export type CentralIconRadius = '0' | '1' | '2' | '3' | string
export type CentralIconStroke = '1' | '1.5' | '2' | string

export type CentralIconStyle = {
  join: CentralIconJoin
  fill: CentralIconFill
  radius: CentralIconRadius
  stroke: CentralIconStroke
}

export const CENTRAL_ICON_DEFAULTS = {
  join: 'round',
  fill: 'filled',
  radius: '1',
  stroke: '1',
} as const satisfies CentralIconStyle

export type CentralIconProps = Omit<SVGProps<SVGSVGElement>, 'name' | 'fill' | 'stroke'> &
  Partial<CentralIconStyle> & {
    name: CentralIconName
    size?: number
  }

const iconRenderers: Record<CentralIconName, FC> = {
  IconInstagram: () => (
    <>
      <rect x="3.75" y="3.75" width="16.5" height="16.5" rx="4.2" />
      <circle cx="12" cy="12" r="4.05" />
      <circle cx="17.1" cy="6.9" r="0.9" fill="currentColor" stroke="none" />
    </>
  ),
  IconLinkedin: () => (
    <>
      <rect x="3.5" y="3.5" width="17" height="17" rx="3.5" />
      <circle cx="8.1" cy="9" r="1.2" fill="currentColor" stroke="none" />
      <path d="M7.1 11.2v5.8" />
      <path d="M10.7 17v-5.8" />
      <path d="M10.7 13.7c0-1.5 1.2-2.7 2.7-2.7s2.5 1.2 2.5 2.7V17" />
    </>
  ),
  IconX: () => (
    <>
      <path d="M4.5 4.5l15 15" />
      <path d="M19.5 4.5L4.5 19.5" />
    </>
  ),
  IconGithub: () => (
    <>
      <path d="M12 3.5a8.5 8.5 0 00-2.7 16.6v-3.1c-2.2.5-2.7-1-2.7-1-.4-1.1-1-1.4-1-1.4-.8-.5.1-.5.1-.5.9.1 1.4.9 1.4.9.8 1.3 2 1 2.5.7.1-.6.3-1 .5-1.2-1.8-.2-3.8-.9-3.8-4a3.1 3.1 0 01.8-2.2 2.9 2.9 0 01.1-2.2s.7-.2 2.3.9a8.2 8.2 0 014.2 0c1.6-1.1 2.3-.9 2.3-.9.3.8.3 1.6.1 2.2a3.1 3.1 0 01.8 2.2c0 3.1-2 3.8-3.8 4 .3.2.6.8.6 1.6v3a8.5 8.5 0 00-2.7-16.6z" />
    </>
  ),
  IconDribbble: () => (
    <>
      <circle cx="12" cy="12" r="8.25" />
      <path d="M7 6.6c2.2 2.4 4.2 5.2 5.9 8.5" />
      <path d="M5 12.2c3.8-.7 7.7-.4 11.8.9" />
      <path d="M10.9 5.1c1.4 2.4 2.5 4.9 3.3 7.6" />
      <path d="M8.9 18.7c2.4-2.3 5.2-3.6 8.5-3.9" />
    </>
  ),
  IconFileText: () => (
    <>
      <path d="M7 3.8h7l4 4V20.2H7z" />
      <path d="M14 3.8v4h4" />
      <path d="M9.6 11.2h4.8" />
      <path d="M9.6 14h6.8" />
      <path d="M9.6 16.8h6.8" />
    </>
  ),
  IconCamera1: () => (
    <>
      <path d="M5 8.6h14a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2z" />
      <path d="M8 8.6l1.2-2.1h5.6L16 8.6" />
      <circle cx="12" cy="13.6" r="3.2" />
    </>
  ),
}

const categoryByName: Record<CentralIconName, CentralIconCategory> = {
  IconInstagram: 'social',
  IconLinkedin: 'social',
  IconX: 'social',
  IconGithub: 'social',
  IconDribbble: 'social',
  IconFileText: 'document',
  IconCamera1: 'media',
}

type IconMetadata = {
  category: CentralIconCategory
}

export const centralIconMetadata = Object.fromEntries(
  Object.entries(categoryByName).map(([name, category]) => [name, { category }]),
) as Record<CentralIconName, IconMetadata>

export const centralIconNames = Object.keys(centralIconMetadata).sort() as CentralIconName[]

export const centralIconNamesByCategory = centralIconNames.reduce(
  (acc, name) => {
    const category = centralIconMetadata[name].category
    if (!acc[category]) {
      acc[category] = []
    }
    acc[category].push(name)
    return acc
  },
  {} as Record<CentralIconCategory, CentralIconName[]>,
)

export const centralIconCategories = Object.keys(centralIconNamesByCategory).sort() as CentralIconCategory[]

export function getCentralIconsByCategory(category: CentralIconCategory): CentralIconName[] {
  return centralIconNamesByCategory[category] ?? []
}

export function withCentralIconDefaults(style: Partial<CentralIconStyle> = {}): CentralIconStyle {
  return {
    ...CENTRAL_ICON_DEFAULTS,
    ...style,
  }
}

export const CentralIcon: FC<CentralIconProps> = ({
  name,
  size = 20,
  join = CENTRAL_ICON_DEFAULTS.join,
  fill = CENTRAL_ICON_DEFAULTS.fill,
  radius = CENTRAL_ICON_DEFAULTS.radius,
  stroke = CENTRAL_ICON_DEFAULTS.stroke,
  className,
  ...props
}) => {
  const Renderer = iconRenderers[name]
  const strokeWidth = Number.parseFloat(stroke)
  const appliedStrokeWidth = Number.isFinite(strokeWidth) ? strokeWidth : 1.75

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={appliedStrokeWidth}
      strokeLinecap={join === 'round' ? 'round' : 'butt'}
      strokeLinejoin={join === 'round' ? 'round' : 'miter'}
      className={className}
      data-central-fill={fill}
      data-central-radius={radius}
      {...props}
    >
      <Renderer />
    </svg>
  )
}

CentralIcon.displayName = 'CentralIcon'
