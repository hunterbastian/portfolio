export interface ImageAnnotationHotspot {
  x: number
  y: number
  label: string
  description: string
}

export type ImageAnnotationTooltipPlacement = 'left' | 'center' | 'right'

export function getNextImageAnnotationActiveIndex(
  currentIndex: number | null,
  nextIndex: number,
): number | null {
  return currentIndex === nextIndex ? null : nextIndex
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

export function isImageAnnotationHotspot(value: unknown): value is ImageAnnotationHotspot {
  if (!value || typeof value !== 'object') return false

  const hotspot = value as Partial<ImageAnnotationHotspot>

  return (
    isFiniteNumber(hotspot.x) &&
    isFiniteNumber(hotspot.y) &&
    typeof hotspot.label === 'string' &&
    typeof hotspot.description === 'string'
  )
}

export function getValidImageAnnotationHotspots(input: unknown): ImageAnnotationHotspot[] {
  if (!Array.isArray(input)) return []

  return input.filter(isImageAnnotationHotspot)
}

export function parseImageAnnotationHotspots(input: ImageAnnotationHotspot[] | string): ImageAnnotationHotspot[] {
  if (Array.isArray(input)) return getValidImageAnnotationHotspots(input)

  try {
    return getValidImageAnnotationHotspots(JSON.parse(input))
  } catch {
    return []
  }
}

export function getImageAnnotationHotspotKey(hotspot: Pick<ImageAnnotationHotspot, 'label' | 'x' | 'y'>): string {
  return `${hotspot.x}-${hotspot.y}-${hotspot.label}`
}

export function getImageAnnotationHotspotPositionStyle(hotspot: Pick<ImageAnnotationHotspot, 'x' | 'y'>) {
  return {
    left: `${hotspot.x}%`,
    top: `${hotspot.y}%`,
    transform: 'translate(-50%, -50%)',
  }
}

export function getImageAnnotationTooltipPlacement(x: number): ImageAnnotationTooltipPlacement {
  if (x > 65) return 'right'
  if (x > 35) return 'center'
  return 'left'
}

export function getImageAnnotationTooltipStyle(x: number) {
  const placement = getImageAnnotationTooltipPlacement(x)

  if (placement === 'right') {
    return { top: '100%', right: '-8px' }
  }

  if (placement === 'center') {
    return { top: '100%', left: '50%', transform: 'translateX(-50%)' }
  }

  return { top: '100%', left: '-8px' }
}
