'use client'

import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  TEXT_TYPE_DEFAULT_COMPLETION_BLINKS,
  TEXT_TYPE_DEFAULT_CURSOR_CHARACTER,
  TEXT_TYPE_DEFAULT_DELETING_SPEED,
  TEXT_TYPE_DEFAULT_PAUSE_DURATION,
  TEXT_TYPE_DEFAULT_TYPING_SPEED,
  activateTextTypeCursorEffectAction,
  activateTextTypeEffectAction,
  getTextTypeClassName,
  getTextTypeCursorClassName,
  getTextTypeCursorEffectAction,
  getTextTypeCursorStyle,
  getTextTypeEffectAction,
  isTextTypeComplete,
  normalizeTextTypeEntries,
  shouldRenderTextTypeCursor,
} from '@/lib/text-type'
import { useMediaQuery } from '@/lib/use-media-query'

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
  typingSpeed = TEXT_TYPE_DEFAULT_TYPING_SPEED,
  deletingSpeed = TEXT_TYPE_DEFAULT_DELETING_SPEED,
  pauseDuration = TEXT_TYPE_DEFAULT_PAUSE_DURATION,
  loop = true,
  showCursor = true,
  cursorCharacter = TEXT_TYPE_DEFAULT_CURSOR_CHARACTER,
  cinematic = false,
  completionBlinks = TEXT_TYPE_DEFAULT_COMPLETION_BLINKS,
  startDelay = 0,
  renderText,
}: TextTypeProps) {
  const texts = useMemo(() => normalizeTextTypeEntries(text), [text])
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const reduceMotion = useMediaQuery('(prefers-reduced-motion: reduce)')
  const [hasStarted, setHasStarted] = useState(startDelay <= 0)
  const [cursorVisible, setCursorVisible] = useState(true)
  const cursorTimerRef = useRef<number | null>(null)
  const isComplete = isTextTypeComplete({ currentTextIndex, displayText, isDeleting, loop, texts })

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
    const action = getTextTypeCursorEffectAction({
      completionBlinks,
      hasStarted,
      isComplete,
      reduceMotion,
      showCursor,
    })

    return activateTextTypeCursorEffectAction({
      action,
      clearTimer: (timer) => window.clearInterval(timer),
      scheduleInterval: (callback, intervalMs) => window.setInterval(callback, intervalMs),
      setCursorVisible,
      timerRef: cursorTimerRef,
    })
  }, [completionBlinks, hasStarted, isComplete, reduceMotion, showCursor])

  useEffect(() => {
    if (!hasStarted) {
      return
    }

    const action = getTextTypeEffectAction({
      cinematic,
      currentTextIndex,
      deletingSpeed,
      displayText,
      isDeleting,
      loop,
      pauseDuration,
      reduceMotion,
      texts,
      typingSpeed,
    })

    const timers = activateTextTypeEffectAction({
      action,
      schedule: (delay, callback) => window.setTimeout(callback, delay),
      setCurrentTextIndex,
      setDisplayText,
      setIsDeleting,
    })

    return () => timers.forEach((timer) => window.clearTimeout(timer))
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
      className={getTextTypeClassName(className, cinematic)}
      aria-label={texts[currentTextIndex] ?? ''}
    >
      {renderText ? renderText(displayText) : displayText}
      {shouldRenderTextTypeCursor(showCursor, hasStarted) ? (
        <span
          aria-hidden="true"
          className={getTextTypeCursorClassName(cinematic)}
          style={getTextTypeCursorStyle(cursorVisible)}
        >
          {cursorCharacter}
        </span>
      ) : null}
    </span>
  )
}
