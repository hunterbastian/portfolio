import type { CSSProperties } from 'react'

export const TILT_CARD_SPRING = { stiffness: 240, damping: 30 } as const
export const TILT_CARD_DEFAULT_MAX_TILT = 2.8
export const TILT_CARD_DEFAULT_PERSPECTIVE = 900
export const TILT_CARD_RESET_ROTATION = { rotateX: 0, rotateY: 0 } as const

export interface TiltCardPointerInput {
  clientX: number
  clientY: number
}

export interface TiltCardRect {
  height: number
  left: number
  top: number
  width: number
}

export interface TiltCardRotation {
  rotateX: number
  rotateY: number
}

export function getTiltCardRotation({
  clientX,
  clientY,
  maxTilt,
  rect,
}: TiltCardPointerInput & {
  maxTilt: number
  rect: TiltCardRect
}): TiltCardRotation {
  const nx = ((clientX - rect.left) / rect.width - 0.5) * 2
  const ny = ((clientY - rect.top) / rect.height - 0.5) * 2

  return {
    rotateX: -ny * maxTilt,
    rotateY: nx * maxTilt,
  }
}

export function getTiltCardOuterStyle(perspective: number): CSSProperties {
  return {
    perspective,
    willChange: 'transform',
  }
}

export function getTiltCardInnerStyle<TRotateX, TRotateY>({
  rotateX,
  rotateY,
  style,
}: {
  rotateX: TRotateX
  rotateY: TRotateY
  style?: CSSProperties
}): CSSProperties & {
  rotateX: TRotateX
  rotateY: TRotateY
} {
  return {
    ...style,
    rotateX,
    rotateY,
    transformStyle: 'preserve-3d',
    willChange: 'transform',
  }
}
