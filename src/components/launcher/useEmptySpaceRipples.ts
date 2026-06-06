'use client'

import { useEffect, useRef, useState } from 'react'
import {
  canCreateEmptySpaceRipple,
  cancelEmptySpaceRippleTimers,
  getNextEmptySpaceRipple,
  getNextEmptySpaceRipples,
  isEmptySpaceRippleInteractiveTarget,
  scheduleEmptySpaceRippleRemoval,
  type EmptySpaceRipple,
} from '@/lib/launcher'

export function useEmptySpaceRipples({
  paletteOpen,
  prefersReducedMotion,
}: {
  paletteOpen: boolean
  prefersReducedMotion: boolean
}) {
  const [ripples, setRipples] = useState<EmptySpaceRipple[]>([])
  const rippleIdRef = useRef(0)
  const rippleTimerRegistryRef = useRef(new Set<number>())

  useEffect(() => {
    return () => {
      cancelEmptySpaceRippleTimers({
        clearTimer: (timer) => window.clearTimeout(timer),
        timerRegistry: rippleTimerRegistryRef,
      })
    }
  }, [])

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!canCreateEmptySpaceRipple({
        interactiveTarget: isEmptySpaceRippleInteractiveTarget(event.target),
        paletteOpen,
        prefersReducedMotion,
      })) {
        return
      }

      const { nextId, ripple } = getNextEmptySpaceRipple(rippleIdRef.current, event)
      rippleIdRef.current = nextId

      setRipples((current) => getNextEmptySpaceRipples(current, ripple))

      scheduleEmptySpaceRippleRemoval({
        rippleId: ripple.id,
        scheduleTimer: (callback, delayMs) => window.setTimeout(callback, delayMs),
        setRipples,
        timerRegistry: rippleTimerRegistryRef,
      })
    }

    window.addEventListener('pointerdown', handlePointerDown, { passive: true })
    return () => window.removeEventListener('pointerdown', handlePointerDown)
  }, [paletteOpen, prefersReducedMotion])

  return ripples
}
