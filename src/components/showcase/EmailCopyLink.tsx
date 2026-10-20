'use client'

import { useEffect, useRef, useState, type MouseEvent, type ReactNode } from 'react'
import {
  EMAIL_COPIED_TOAST,
  EMAIL_COPY_TOAST_MS,
  copyEmailAddress,
  getEmailAddressFromHref,
} from '@/lib/email-copy'

interface EmailCopyLinkProps {
  href: string
  children: ReactNode
  className?: string
  onClick?: () => void
}

export default function EmailCopyLink({ href, children, className, onClick }: EmailCopyLinkProps) {
  const [message, setMessage] = useState<string | null>(null)
  const timer = useRef<number | null>(null)

  useEffect(() => {
    return () => {
      if (timer.current !== null) window.clearTimeout(timer.current)
    }
  }, [])

  async function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    onClick?.()
    const address = getEmailAddressFromHref(href)
    if (!address) return

    event.preventDefault()
    const result = await copyEmailAddress(address)
    if (result !== 'copied') {
      window.location.assign(href)
      return
    }

    if (timer.current !== null) window.clearTimeout(timer.current)
    setMessage(EMAIL_COPIED_TOAST)
    timer.current = window.setTimeout(() => {
      setMessage(null)
      timer.current = null
    }, EMAIL_COPY_TOAST_MS)
  }

  return (
    <>
      <a href={href} className={className} onClick={handleClick}>
        {children}
      </a>
      <span
        className="email-copy-toast"
        role="status"
        aria-live="polite"
        aria-atomic="true"
        data-visible={message ? 'true' : 'false'}
      >
        {message}
      </span>
    </>
  )
}
