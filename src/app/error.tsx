'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import {
  GLOBAL_ERROR_DESCRIPTION,
  GLOBAL_ERROR_EYEBROW,
  GLOBAL_ERROR_FONT_STYLE,
  GLOBAL_ERROR_HOME_CLASS,
  GLOBAL_ERROR_RETRY_CLASS,
  GLOBAL_ERROR_RETRY_LABEL,
  GLOBAL_ERROR_TITLE,
  getGlobalErrorHomeAction,
  logGlobalError,
} from '@/lib/global-error'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  const homeAction = getGlobalErrorHomeAction()

  useEffect(() => {
    logGlobalError(error)
  }, [error])

  return (
    <div className="flex min-h-[calc(100vh-140px)] items-center justify-center px-4">
      <div className="max-w-sm text-center">
        <p
          className="text-[11px] tracking-[0.14em] uppercase text-muted-foreground"
          style={GLOBAL_ERROR_FONT_STYLE}
        >
          {GLOBAL_ERROR_EYEBROW}
        </p>
        <h2 className="mt-3 text-sm font-medium tracking-[0.06em] text-foreground" style={GLOBAL_ERROR_FONT_STYLE}>
          {GLOBAL_ERROR_TITLE}
        </h2>
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground" style={GLOBAL_ERROR_FONT_STYLE}>
          {GLOBAL_ERROR_DESCRIPTION}
        </p>
        <div className="mt-8 flex items-center justify-center gap-6">
          <button
            onClick={() => reset()}
            className={GLOBAL_ERROR_RETRY_CLASS}
          >
            {GLOBAL_ERROR_RETRY_LABEL}
          </button>
          <Link
            href={homeAction.href}
            className={GLOBAL_ERROR_HOME_CLASS}
            style={GLOBAL_ERROR_FONT_STYLE}
          >
            {homeAction.label}
          </Link>
        </div>
      </div>
    </div>
  )
}
