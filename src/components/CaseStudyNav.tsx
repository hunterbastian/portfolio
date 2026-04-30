'use client'

import { useEffect, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { useWebHaptics } from 'web-haptics/react'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'

interface Chapter {
  id: string
  title: string
}

export default function CaseStudyNav() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [activeChapter, setActiveChapter] = useState('')
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()

  // Discover chapters from [data-chapter] elements
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>('[data-chapter]')
    const found: Chapter[] = []
    elements.forEach((el) => {
      const id = el.dataset.chapter ?? ''
      const title = el.dataset.chapterTitle ?? ''
      if (id) found.push({ id, title })
    })
    setChapters(found)
    if (found.length > 0) setActiveChapter(found[0].id)
  }, [])

  // Track which chapter is in view
  useEffect(() => {
    if (chapters.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const id = (entry.target as HTMLElement).dataset.chapter
            if (id) setActiveChapter(id)
          }
        }
      },
      { rootMargin: '-20% 0px -60% 0px' },
    )

    const elements = document.querySelectorAll('[data-chapter]')
    elements.forEach((el) => observer.observe(el))

    return () => observer.disconnect()
  }, [chapters])

  if (chapters.length === 0) return null

  return (
    <div className="absolute -left-20 top-0 bottom-0 hidden xl:block w-14">
      <nav
        className="sticky top-[33vh] flex flex-col gap-3"
        aria-label="Case study chapters"
      >
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeChapter

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() => {
                haptic.trigger('light')
                const el = document.querySelector(`[data-chapter="${chapter.id}"]`)
                el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
              }}
              className="group flex min-h-[40px] origin-center touch-manipulation items-center gap-2 text-left transition-transform duration-150 active:translate-y-0 active:scale-[0.96] focus-visible:outline-none"
              aria-current={isActive ? 'step' : undefined}
              aria-label={`Chapter ${chapter.id}: ${chapter.title}`}
            >
              <m.span
                className="block rounded-full"
                animate={{
                  width: isActive ? 16 : 4,
                  height: 4,
                  opacity: isActive ? 0.9 : 0.15,
                  backgroundColor: isActive ? 'var(--accent)' : 'var(--foreground)',
                }}
                transition={{
                  duration: motionDurationMs(300, prefersReducedMotion),
                  ease: MOTION_EASE_SOFT,
                }}
              />
              <span
                className={`font-mono text-[10px] tracking-[0.08em] transition-opacity duration-200 ${
                  isActive
                    ? 'text-foreground opacity-70'
                    : 'text-muted-foreground opacity-0 group-hover:opacity-50'
                }`}
              >
                {chapter.id}
              </span>
            </button>
          )
        })}
      </nav>
    </div>
  )
}
