'use client'

import { useEffect, useRef } from 'react'
import {
  getHoverCueTarget,
  isHoverCuePointerType,
  shouldPlayHoverCue,
} from '@/lib/sounds/hover-cue'
import { useSound } from '@/lib/sounds/context'

export default function HoverSoundCue() {
  const { enabled, play } = useSound()
  const lastPlayedAtRef = useRef(Number.NEGATIVE_INFINITY)

  useEffect(() => {
    if (!enabled) return

    const handlePointerOver = (event: PointerEvent) => {
      if (!isHoverCuePointerType(event.pointerType)) return

      const target = getHoverCueTarget(event.target)
      if (!target) return

      const now = performance.now()
      const relatedTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null
      if (!shouldPlayHoverCue({
        lastPlayedAt: lastPlayedAtRef.current,
        now,
        relatedTarget,
        target,
      })) {
        return
      }

      lastPlayedAtRef.current = now
      play('hoverClick')
    }

    document.addEventListener('pointerover', handlePointerOver, { passive: true })
    return () => document.removeEventListener('pointerover', handlePointerOver)
  }, [enabled, play])

  return null
}
