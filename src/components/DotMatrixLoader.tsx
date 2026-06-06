import {
  DOT_MATRIX_BRAND_MARK,
  DOT_MATRIX_DOTS,
  getDotMatrixDotStyleVars,
  getDotMatrixRootClassName,
  getDotMatrixStackClassName,
  getDotMatrixStyleVars,
} from '@/lib/dot-matrix-loader'

interface DotMatrixLoaderProps {
  className?: string
  size?: number
  dotSize?: number
  label?: string
  fullscreen?: boolean
}

export default function DotMatrixLoader({
  className,
  size = 52,
  dotSize = 6,
  label = 'Loading',
  fullscreen = true,
}: DotMatrixLoaderProps) {
  return (
    <div
      aria-label={label}
      aria-live="polite"
      className={getDotMatrixRootClassName(fullscreen, className)}
      role="status"
    >
      {fullscreen ? (
        <>
          <div className="absolute inset-0 bg-background/82 backdrop-blur-xl" />
          <div
            aria-hidden="true"
            className="absolute inset-0 opacity-[0.18]"
            style={{
              backgroundImage:
                'radial-gradient(circle at center, rgba(var(--grain-rgb), 0.36) 0 0.8px, transparent 1px)',
              backgroundSize: '18px 18px',
            }}
          />
        </>
      ) : null}

      <div className={getDotMatrixStackClassName(fullscreen)}>
        <div aria-hidden="true" className="dot-matrix-loader" style={getDotMatrixStyleVars(size, dotSize)}>
          {DOT_MATRIX_DOTS.map(({ index, opacity, order }) => {
            return (
              <span
                className="dot-matrix-loader__dot"
                key={index}
                style={getDotMatrixDotStyleVars({ opacity, order })}
              />
            )
          })}
        </div>

        {fullscreen ? (
          <span className="font-header text-[9px] leading-none tracking-[0.28em] text-foreground/42 select-none">
            {DOT_MATRIX_BRAND_MARK}
          </span>
        ) : null}
      </div>
    </div>
  )
}
