'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'

interface TextTypeProps {
  text: string | string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  loop?: boolean
  showCursor?: boolean
  cursorCharacter?: string
  cinematic?: boolean
  completionBlinks?: number
  startDelay?: number
  renderText?: (displayText: string) => ReactNode
}

export default function TextType({
  text,
  className,
  typingSpeed = 65,
  deletingSpeed = 40,
  pauseDuration = 1500,
  loop = true,
  showCursor = true,
  cursorCharacter = '|',
  cinematic = false,
  completionBlinks = 2,
  startDelay = 0,
  renderText,
}: TextTypeProps) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text])
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
  const [hasStarted, setHasStarted] = useState(startDelay <= 0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const cursorTimerRef = useRef<number | null>(null)
  const isComplete =
    !loop &&
    !isDeleting &&
    currentTextIndex === texts.length - 1 &&
    displayText === (texts[texts.length - 1] ?? '')

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const updateReduceMotion = () => setReduceMotion(media.matches)
    updateReduceMotion()
    media.addEventListener('change', updateReduceMotion)

    return () => media.removeEventListener('change', updateReduceMotion)
  }, [])

  useEffect(() => {
    if (reduceMotion || startDelay <= 0) {
      setHasStarted(true)
      return
    }

    setHasStarted(false)
    const startTimer = window.setTimeout(() => {
      setHasStarted(true)
    }, startDelay)

    return () => window.clearTimeout(startTimer)
  }, [reduceMotion, startDelay, texts])

  useEffect(() => {
    if (!hasStarted) {
      setCurrentTextIndex(0)
      setDisplayText('')
      setIsDeleting(false)
    }
  }, [hasStarted])

  useEffect(() => {
    if (cursorTimerRef.current !== null) {
      window.clearInterval(cursorTimerRef.current)
      cursorTimerRef.current = null
    }

    if (!showCursor) {
      setCursorVisible(false)
      return
    }

    if (!hasStarted) {
      setCursorVisible(false)
      return
    }

    if (isComplete) {
      if (reduceMotion || completionBlinks <= 0) {
        setCursorVisible(false)
        return
      }

      let stepCount = 0
      const maxSteps = completionBlinks * 2
      setCursorVisible(true)

      cursorTimerRef.current = window.setInterval(() => {
        stepCount += 1
        if (stepCount >= maxSteps) {
          if (cursorTimerRef.current !== null) {
            window.clearInterval(cursorTimerRef.current)
            cursorTimerRef.current = null
          }
          setCursorVisible(false)
          return
        }
        setCursorVisible((prev) => !prev)
      }, 220)

      return () => {
        if (cursorTimerRef.current !== null) {
          window.clearInterval(cursorTimerRef.current)
          cursorTimerRef.current = null
        }
      }
    }

    if (reduceMotion) {
      setCursorVisible(true)
      return
    }

    cursorTimerRef.current = window.setInterval(() => {
      setCursorVisible((prev) => !prev)
    }, 530)

    return () => {
      if (cursorTimerRef.current !== null) {
        window.clearInterval(cursorTimerRef.current)
        cursorTimerRef.current = null
      }
    }
  }, [completionBlinks, hasStarted, isComplete, reduceMotion, showCursor])

  useEffect(() => {
    if (!texts.length) {
      return
    }

    if (!hasStarted) {
      return
    }

    if (reduceMotion) {
      setDisplayText(texts[0])
      return
    }

    const currentText = texts[currentTextIndex]
    if (displayText === currentText && !isDeleting) {
      if (!loop && currentTextIndex === texts.length - 1) {
        return
      }

      const pauseTimer = window.setTimeout(() => setIsDeleting(true), pauseDuration)
      return () => window.clearTimeout(pauseTimer)
    }

    if (displayText.length === 0 && isDeleting) {
      setIsDeleting(false)
      setCurrentTextIndex((prev) => (prev + 1) % texts.length)
      return
    }

    const nextLength = isDeleting ? displayText.length - 1 : displayText.length + 1
    const nextText = currentText.slice(0, nextLength)
    let speed = isDeleting ? deletingSpeed : typingSpeed

    if (cinematic && !isDeleting) {
      const nextChar = currentText[nextLength - 1] ?? ''
      const progress = currentText.length ? nextLength / currentText.length : 1
      const progressMultiplier = 1.08 - Math.min(progress, 0.9) * 0.24
      speed = Math.max(22, Math.round(speed * progressMultiplier))

      if (/[,.!?;:]/.test(nextChar)) {
        speed += 90
      }

      if (nextChar === '\n') {
        speed += 240
      }

      if (displayText.length === 0 && currentTextIndex === 0) {
        speed += 180
      }

      speed += Math.floor(Math.random() * 18) - 9
    }

    const typeTimer = window.setTimeout(() => setDisplayText(nextText), speed)
    return () => window.clearTimeout(typeTimer)
  }, [
    cinematic,
    currentTextIndex,
    deletingSpeed,
    displayText,
    isDeleting,
    loop,
    pauseDuration,
    reduceMotion,
    hasStarted,
    texts,
    typingSpeed,
  ])

  return (
    <span
      className={`${className ?? ''}${cinematic ? ' text-type-cinematic' : ''}`}
      aria-label={texts[currentTextIndex] ?? ''}
    >
      {renderText ? renderText(displayText) : displayText}
      {showCursor && hasStarted ? (
        <span
          aria-hidden="true"
          className={`inline-block ml-1${cinematic ? ' text-type-cinematic-cursor' : ''}`}
          style={{ opacity: cursorVisible ? 1 : 0 }}
        >
          {cursorCharacter}
        </span>
      ) : null}
    </span>
  )
}
