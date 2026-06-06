'use client'

import { useEffect } from 'react'

export interface BodyScrollLockStyle {
  overflow: string
}

export function activateBodyScrollLock(style: BodyScrollLockStyle) {
  const previousOverflow = style.overflow
  style.overflow = 'hidden'

  return () => {
    style.overflow = previousOverflow
  }
}

export function useBodyScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return

    return activateBodyScrollLock(document.body.style)
  }, [active])
}
