import type { AnchorHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'
import styles from './EmailButton.module.css'

type EmailButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & {
  email: string
  label?: string
}

export function EmailButton({
  email,
  label = 'email me',
  className,
  'aria-label': ariaLabel,
  ...props
}: EmailButtonProps) {
  return (
    <a
      {...props}
      href={`mailto:${email}`}
      aria-label={ariaLabel ?? `Email me directly at ${email}`}
      className={cn(styles.button, className)}
    >
      <span className={styles.label}>{label}</span>
    </a>
  )
}
