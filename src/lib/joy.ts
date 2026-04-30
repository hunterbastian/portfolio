'use client'

export const JOY_TOAST_EVENT = 'hb:joy-toast'

export interface JoyToastDetail {
  message: string
}

export function showJoyToast(message: string) {
  if (typeof window === 'undefined') return

  window.dispatchEvent(
    new CustomEvent<JoyToastDetail>(JOY_TOAST_EVENT, {
      detail: { message },
    }),
  )
}
