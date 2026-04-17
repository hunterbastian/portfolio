import styles from './pixel.module.css'

type Props = { className?: string; ariaLabel?: string }

export default function PixelDivider({ className, ariaLabel }: Props) {
  return (
    <svg
      className={[styles.crisp, className].filter(Boolean).join(' ')}
      width={36}
      height={4}
      viewBox="0 0 36 4"
      role={ariaLabel ? 'img' : 'presentation'}
      aria-label={ariaLabel}
      aria-hidden={ariaLabel ? undefined : true}
    >
      <rect x="0" y="0" width="4" height="4" fill="currentColor" />
      <rect x="16" y="0" width="4" height="4" fill="currentColor" />
      <rect x="32" y="0" width="4" height="4" fill="currentColor" />
    </svg>
  )
}
