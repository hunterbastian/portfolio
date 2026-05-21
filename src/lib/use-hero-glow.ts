'use client'

import { useEffect, useRef, useState, type PointerEvent } from 'react'

const LERP_FACTOR = 0.09
const GLOW_MAX_X = 16
const GLOW_MAX_Y = 8
const GRAIN_PARALLAX_RATIO = 0.55
const SETTLE_THRESHOLD = 0.002

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max)
}

export function useHeroGlow() {
  const [isActive, setIsActive] = useState(false)
  const glowRef = useRef<HTMLDivElement | null>(null)
  const grainRef = useRef<HTMLDivElement | null>(null)
  const boundsRef = useRef<DOMRect | null>(null)
  const frameRef = useRef<number | null>(null)
  const pointerRef = useRef({ x: 0, y: 0 })
  const currentRef = useRef({ x: 0, y: 0 })

  useEffect(() => {
    return () => {
      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current)
      }
    }
  }, [])

  const writePosition = () => {
    const glow = glowRef.current
    const grain = grainRef.current
    const target = pointerRef.current
    const current = currentRef.current

    current.x += (target.x - current.x) * LERP_FACTOR
    current.y += (target.y - current.y) * LERP_FACTOR

    const glowX = clamp(current.x * GLOW_MAX_X, -GLOW_MAX_X, GLOW_MAX_X)
    const glowY = clamp(current.y * GLOW_MAX_Y, -GLOW_MAX_Y, GLOW_MAX_Y)

    if (glow) {
      glow.style.setProperty('--hero-glow-cursor-x', `${glowX}px`)
      glow.style.setProperty('--hero-glow-cursor-y', `${glowY}px`)
    }

    if (grain) {
      grain.style.setProperty('--hero-grain-cursor-x', `${glowX * GRAIN_PARALLAX_RATIO}px`)
      grain.style.setProperty('--hero-grain-cursor-y', `${glowY * GRAIN_PARALLAX_RATIO}px`)
    }

    if (
      Math.abs(target.x - current.x) > SETTLE_THRESHOLD ||
      Math.abs(target.y - current.y) > SETTLE_THRESHOLD
    ) {
      frameRef.current = window.requestAnimationFrame(writePosition)
      return
    }

    currentRef.current = { x: target.x, y: target.y }
    frameRef.current = null
  }

  const schedule = () => {
    if (frameRef.current === null) {
      frameRef.current = window.requestAnimationFrame(writePosition)
    }
  }

  const onPointerEnter = (event: PointerEvent<HTMLElement>) => {
    setIsActive(true)
    boundsRef.current = event.currentTarget.getBoundingClientRect()
  }

  const onPointerMove = (event: PointerEvent<HTMLElement>) => {
    const rect = boundsRef.current ?? event.currentTarget.getBoundingClientRect()
    boundsRef.current = rect

    pointerRef.current = {
      x: (event.clientX - (rect.left + rect.width / 2)) / (rect.width / 2),
      y: (event.clientY - (rect.top + rect.height / 2)) / (rect.height / 2),
    }

    schedule()
  }

  const onPointerLeave = () => {
    boundsRef.current = null
    pointerRef.current = { x: 0, y: 0 }
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
