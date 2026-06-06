import type { CSSProperties } from 'react'
import { cn } from './utils.ts'

export const DOT_MATRIX_GRID_SIZE = 5
export const DOT_MATRIX_FULLSCREEN_ROOT_CLASS =
  'fixed inset-0 z-50 flex items-center justify-center overflow-hidden'
export const DOT_MATRIX_INLINE_ROOT_CLASS = 'inline-flex items-center justify-center'
export const DOT_MATRIX_STACK_BASE_CLASS = 'relative z-10 flex flex-col items-center'
export const DOT_MATRIX_FULLSCREEN_STACK_GAP_CLASS = 'gap-5'
export const DOT_MATRIX_INLINE_STACK_GAP_CLASS = 'gap-0'
export const DOT_MATRIX_BRAND_MARK = 'HB'

export const DOT_MATRIX_SPIRAL_PATH: readonly number[] = [
  0, 1, 2, 3, 4,
  9, 14, 19, 24,
  23, 22, 21, 20,
  15, 10, 5,
  6, 7, 8,
  13, 18,
  17, 16,
  11,
  12,
]

export interface DotMatrixLayout {
  gap: number
  matrixSize: number
}

export interface DotMatrixDot {
  index: number
  opacity: number
  order: number
}

export type DotMatrixStyleVars = CSSProperties & {
  '--dotmatrix-dot-size': string
  '--dotmatrix-gap': string
  '--dotmatrix-size': string
}

export type DotMatrixDotStyleVars = CSSProperties & {
  '--dotmatrix-order': number
  opacity: number
}

export const DOT_MATRIX_SPIRAL_ORDER = Array.from(
  { length: DOT_MATRIX_GRID_SIZE * DOT_MATRIX_GRID_SIZE },
  (_, index) => DOT_MATRIX_SPIRAL_PATH.indexOf(index),
)

export function getDotMatrixLayout(size: number, dotSize: number): DotMatrixLayout {
  const safeSize = Math.max(size, dotSize * DOT_MATRIX_GRID_SIZE)
  const gap = Math.max(2, Math.floor((safeSize - dotSize * DOT_MATRIX_GRID_SIZE) / (DOT_MATRIX_GRID_SIZE - 1)))

  return {
    gap,
    matrixSize: dotSize * DOT_MATRIX_GRID_SIZE + gap * (DOT_MATRIX_GRID_SIZE - 1),
  }
}

export function getDotMatrixOpacity(order: number, dotCount = DOT_MATRIX_SPIRAL_ORDER.length): number {
  if (dotCount <= 1) return 1

  return 0.16 + (order / (dotCount - 1)) * 0.64
}

export const DOT_MATRIX_DOTS: readonly DotMatrixDot[] = DOT_MATRIX_SPIRAL_ORDER.map((order, index) => ({
  index,
  opacity: getDotMatrixOpacity(order),
  order,
}))

export function getDotMatrixStyleVars(size: number, dotSize: number): DotMatrixStyleVars {
  const { gap, matrixSize } = getDotMatrixLayout(size, dotSize)

  return {
    '--dotmatrix-dot-size': `${dotSize}px`,
    '--dotmatrix-gap': `${gap}px`,
    '--dotmatrix-size': `${matrixSize}px`,
  }
}

export function getDotMatrixDotStyleVars({ opacity, order }: Pick<DotMatrixDot, 'opacity' | 'order'>): DotMatrixDotStyleVars {
  return {
    '--dotmatrix-order': order,
    opacity,
  }
}

export function getDotMatrixRootClassName(fullscreen: boolean, className?: string): string {
  return cn(fullscreen ? DOT_MATRIX_FULLSCREEN_ROOT_CLASS : DOT_MATRIX_INLINE_ROOT_CLASS, className)
}

export function getDotMatrixStackClassName(fullscreen: boolean): string {
  return cn(DOT_MATRIX_STACK_BASE_CLASS, fullscreen ? DOT_MATRIX_FULLSCREEN_STACK_GAP_CLASS : DOT_MATRIX_INLINE_STACK_GAP_CLASS)
}
