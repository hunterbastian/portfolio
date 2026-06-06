'use client'

import { useEffect, useRef, useState } from 'react'
import { JOY_TOAST_EVENT, type JoyToastDetail } from '@/lib/joy'
import {
  LAUNCHER_TOAST_TIMEOUT_MS,
  cancelLauncherToastDismiss,
  getNextLauncherToastState,
  scheduleLauncherToastDismiss,
  type LauncherToast,
} from '@/lib/launcher'

export function useJoyToastState(timeoutMs = LAUNCHER_TOAST_TIMEOUT_MS) {
  const [toast, setToast] = useState<LauncherToast | null>(null)
  const toastIdRef = useRef(0)
  const toastTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const handleToast = (event: Event) => {
      const detail = (event as CustomEvent<JoyToastDetail>).detail
      const next = getNextLauncherToastState(toastIdRef.current, detail)
      if (!next.toast) return

      toastIdRef.current = next.nextId
      setToast(next.toast)

      scheduleLauncherToastDismiss({
        clearTimer: (timer) => clearTimeout(timer),
        scheduleTimer: (callback, delayMs) => setTimeout(callback, delayMs),
        setToast,
        timerRef: toastTimerRef,
        timeoutMs,
      })
    }

    window.addEventListener(JOY_TOAST_EVENT, handleToast)

    return () => {
      window.removeEventListener(JOY_TOAST_EVENT, handleToast)
      cancelLauncherToastDismiss({ clearTimer: (timer) => clearTimeout(timer), timerRef: toastTimerRef })
    }
  }, [timeoutMs])

  return toast
}
