import type { AnchorHTMLAttributes } from 'react'
import { ArrowUpRight } from 'lucide-react'
import {
  chromePillClassName,
  chromePillContactAccentClassName,
  chromePillIconClassName,
  chromePillLabelClassName,
} from '@/components/ui/tactile'
import { cn } from '@/lib/utils'
import {
  DEFAULT_EMAIL_BUTTON_LABEL,
  getEmailButtonViewState,
} from '@/lib/email-button'

type EmailButtonProps = Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'children' | 'href'> & {
  email: string
  label?: string
}

export function EmailButton({
  email,
  label = DEFAULT_EMAIL_BUTTON_LABEL,
  className,
  'aria-label': ariaLabel,
  ...props
}: EmailButtonProps) {
  const viewState = getEmailButtonViewState({ email, label, ariaLabel })

  return (
    <a
      {...props}
      href={viewState.href}
      aria-label={viewState.ariaLabel}
      className={chromePillClassName({
        size: 'contact-primary',
        className: cn(chromePillContactAccentClassName, className),
      })}
    >
      <span className={chromePillLabelClassName}>{viewState.label}</span>
      <ArrowUpRight
        aria-hidden="true"
        strokeWidth={1.7}
        className={`${chromePillIconClassName} h-[0.45rem] w-[0.45rem]`}
      />
    </a>
  )
}
