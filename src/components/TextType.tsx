'use client'

import { useEffect, useMemo, useRef, useState } from 'react'

interface TextTypeProps {
  text: string | string[]
  className?: string
  typingSpeed?: number
  deletingSpeed?: number
  pauseDuration?: number
  loop?: boolean
  showCursor?: boolean
  cursorCharacter?: string
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
}: TextTypeProps) {
  const texts = useMemo(() => (Array.isArray(text) ? text : [text]), [text])
  const [currentTextIndex, setCurrentTextIndex] = useState(0)
  const [displayText, setDisplayText] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [reduceMotion, setReduceMotion] = useState(false)
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
    if (cursorTimerRef.current !== null) {
      window.clearInterval(cursorTimerRef.current)
      cursorTimerRef.current = null
    }

    if (!showCursor || reduceMotion || isComplete) {
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
  }, [isComplete, reduceMotion, showCursor])

  useEffect(() => {
    if (!texts.length) {
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
    const speed = isDeleting ? deletingSpeed : typingSpeed

    const typeTimer = window.setTimeout(() => setDisplayText(nextText), speed)
    return () => window.clearTimeout(typeTimer)
  }, [
    currentTextIndex,
    deletingSpeed,
    displayText,
    isDeleting,
    loop,
    pauseDuration,
    reduceMotion,
    texts,
    typingSpeed,
  ])

  return (
    <span className={className} aria-label={texts[currentTextIndex] ?? ''}>
      {displayText}
      {showCursor ? (
        <span aria-hidden="true" className="inline-block ml-1" style={{ opacity: cursorVisible ? 1 : 0 }}>
          {cursorCharacter}
        </span>
      ) : null}
    </span>
  )
}
