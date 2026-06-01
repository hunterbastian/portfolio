import type { AnchorHTMLAttributes } from 'react'
import { chromePillClassName, chromePillLabelClassName } from '@/components/ui/tactile'

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
      className={chromePillClassName({ size: 'contact-primary', className })}
    >
      <span className={chromePillLabelClassName}>{label}</span>
    </a>
  )
}
