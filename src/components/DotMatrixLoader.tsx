import type { CSSProperties } from 'react'
import { cn } from '@/lib/utils'

interface DotMatrixLoaderProps {
  className?: string
  size?: number
  dotSize?: number
  label?: string
  fullscreen?: boolean
}

type MatrixStyle = CSSProperties & {
  '--dotmatrix-size'?: string
  '--dotmatrix-dot-size'?: string
  '--dotmatrix-gap'?: string
}

type DotStyle = CSSProperties & {
  '--dotmatrix-order'?: number
}

const MATRIX_SIZE = 5

const SPIRAL_PATH = [
  0, 1, 2, 3, 4,
  9, 14, 19, 24,
  23, 22, 21, 20,
  15, 10, 5,
  6, 7, 8,
  13, 18,
  17, 16,
  11,
  12,
] as const

const SPIRAL_ORDER = Array.from({ length: MATRIX_SIZE * MATRIX_SIZE }, (_, index) =>
  SPIRAL_PATH.indexOf(index as (typeof SPIRAL_PATH)[number]),
)

const DOTS = SPIRAL_ORDER.map((order, index) => ({ index, order }))

export default function DotMatrixLoader({
  className,
  size = 52,
  dotSize = 6,
  label = 'Loading',
  fullscreen = true,
}: DotMatrixLoaderProps) {
  const safeSize = Math.max(size, dotSize * MATRIX_SIZE)
  const gap = Math.max(2, Math.floor((safeSize - dotSize * MATRIX_SIZE) / (MATRIX_SIZE - 1)))
  const matrixSize = dotSize * MATRIX_SIZE + gap * (MATRIX_SIZE - 1)

  const matrixStyle: MatrixStyle = {
    '--dotmatrix-size': `${matrixSize}px`,
    '--dotmatrix-dot-size': `${dotSize}px`,
    '--dotmatrix-gap': `${gap}px`,
  }

  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={cn(
        fullscreen
          ? 'fixed inset-0 z-50 flex items-center justify-center overflow-hidden'
          : 'inline-flex items-center justify-center',
        className,
      )}
      role="status"
    >
      {fullscreen ? (
        <>
          <div className="absolute inset-0 bg-background/82 backdrop-blur-xl dark:bg-background/88" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.18] dark:opacity-[0.11]"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(var(--grain-rgb), 0.36) 0 0.8px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
        </>
      ) : null}

      <div className={cn('relative z-10 flex flex-col items-center', fullscreen ? 'gap-5' : 'gap-0')}>
        <div aria-hidden="true" className="dot-matrix-loader" style={matrixStyle}>
          {DOTS.map(({ index, order }) => {
            const dotStyle: DotStyle = {
              '--dotmatrix-order': order,
              opacity: 0.16 + (order / (DOTS.length - 1)) * 0.64,
            }

            return <span className="dot-matrix-loader__dot" key={index} style={dotStyle} />
          })}
        </div>

        {fullscreen ? (
          <span className="font-header text-[9px] leading-none tracking-[0.28em] text-foreground/42 select-none">
            HB
          </span>
        ) : null}
      </div>
    </div>
  )
}
