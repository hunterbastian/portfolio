'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

const SCRAMBLE_CHARS = '0123456789°./NSEW'
const SCRAMBLE_SPEED = 30
const SCRAMBLE_ROUNDS = 3

export function useScrambleText(original: string, autoPlay = false, autoDelay = 0) {
  const [display, setDisplay] = useState(original)
  const frameRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const hasAutoPlayed = useRef(false)

  const scramble = useCallback(() => {
    if (frameRef.current) return
    let round = 0
    const chars = original.split('')

    frameRef.current = setInterval(() => {
      const progress = round / (chars.length * SCRAMBLE_ROUNDS)
      const resolved = Math.floor(progress * chars.length)

      const next = chars.map((char, i) => {
        if (char === ' ') return ' '
        if (i < resolved) return char
        return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
      })

      setDisplay(next.join(''))
      round++

      if (round >= chars.length * SCRAMBLE_ROUNDS) {
        if (frameRef.current) clearInterval(frameRef.current)
        frameRef.current = null
        setDisplay(original)
      }
    }, SCRAMBLE_SPEED)
  }, [original])

  useEffect(() => {
    if (autoPlay && !hasAutoPlayed.current) {
      hasAutoPlayed.current = true
      const timer = setTimeout(() => scramble(), autoDelay)
      return () => clearTimeout(timer)
    }
  }, [autoPlay, autoDelay, scramble])

  useEffect(() => {
    return () => {
      if (frameRef.current) clearInterval(frameRef.current)
    }
  }, [])

  return { display, scramble }
}
