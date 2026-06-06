import styles from './pixel.module.css'
import {
  PIXEL_DIVIDER_HEIGHT,
  PIXEL_DIVIDER_RECT_FILL,
  PIXEL_DIVIDER_RECT_SIZE,
  PIXEL_DIVIDER_RECT_X_POSITIONS,
  PIXEL_DIVIDER_VIEW_BOX,
  PIXEL_DIVIDER_WIDTH,
  getPixelDividerAriaHidden,
  getPixelDividerClassName,
  getPixelDividerRole,
} from '@/lib/pixel-divider'

type Props = { className?: string; ariaLabel?: string }

export default function PixelDivider({ className, ariaLabel }: Props) {
  return (
    <svg
      className={getPixelDividerClassName(styles.crisp, className)}
      width={PIXEL_DIVIDER_WIDTH}
      height={PIXEL_DIVIDER_HEIGHT}
      viewBox={PIXEL_DIVIDER_VIEW_BOX}
      role={getPixelDividerRole(ariaLabel)}
      aria-label={ariaLabel}
      aria-hidden={getPixelDividerAriaHidden(ariaLabel)}
    >
      {PIXEL_DIVIDER_RECT_X_POSITIONS.map((x) => (
        <rect
          key={x}
          x={x}
          y="0"
          width={PIXEL_DIVIDER_RECT_SIZE}
          height={PIXEL_DIVIDER_RECT_SIZE}
          fill={PIXEL_DIVIDER_RECT_FILL}
        />
      ))}
    </svg>
  )
}
