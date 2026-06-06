'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'
import {
  HERO_GLOW_ORIGIN,
  applyHeroGlowCssVariables,
  cancelHeroGlowFrame,
  getHeroGlowAnimationStep,
  getHeroGlowPointerRatio,
  requestHeroGlowFrame,
  scheduleHeroGlowFrameIfIdle,
} from './hero-glow.ts'

export function useHeroGlow() {
  const [isActive, setIsActive] = useState(false)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const grainRef = useRef<HTMLDivElement | null>(null)
  const boundsRef = useRef<DOMRect | null>(null)
  const frameRef = useRef<number | null>(null)
  const pointerRef = useRef({ ...HERO_GLOW_ORIGIN })
  const currentRef = useRef({ ...HERO_GLOW_ORIGIN })

  useEffect(() => {
    return () => {
      cancelHeroGlowFrame({ cancelFrame: (frame) => window.cancelAnimationFrame(frame), frameRef })
    }
  }, [])

  const writePosition = () => {
    const glow = glowRef.current
    const grain = grainRef.current
    const target = pointerRef.current
    const step = getHeroGlowAnimationStep(currentRef.current, target)

    currentRef.current = step.point
    applyHeroGlowCssVariables({ glow, grain, point: step.point })

    if (step.shouldContinue) {
      requestHeroGlowFrame({
        callback: writePosition,
        frameRef,
        requestFrame: (callback) => window.requestAnimationFrame(callback),
      })
      return
    }

    currentRef.current = step.settledPoint
    frameRef.current = null
  }

  const schedule = () => {
    scheduleHeroGlowFrameIfIdle({
      callback: writePosition,
      frameRef,
      requestFrame: (callback) => window.requestAnimationFrame(callback),
    })
  }

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    setIsActive(true)
    boundsRef.current = event.currentTarget.getBoundingClientRect()
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = boundsRef.current ?? event.currentTarget.getBoundingClientRect()
    boundsRef.current = rect

    pointerRef.current = getHeroGlowPointerRatio(event, rect)

    schedule()
  }

  const onPointerLeave = () => {
    boundsRef.current = null
    pointerRef.current = { ...HERO_GLOW_ORIGIN }
    setIsActive(false)
    schedule()
  }

  return {
    glowRef,
    grainRef,
    isActive,
    handlers: { onPointerEnter, onPointerMove, onPointerLeave },
  }
}
