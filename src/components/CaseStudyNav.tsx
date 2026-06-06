'use client'

import { useEffect, useState } from 'react'
import { m, useReducedMotion } from 'framer-motion'
import { useWebHaptics } from 'web-haptics/react'
import { MOTION_EASE_SOFT, motionDurationMs } from '@/lib/motion'
import { analytics } from '@/lib/analytics'
import {
  CASE_STUDY_CHAPTER_BUTTON_CLASS_NAME,
  CASE_STUDY_CHAPTER_MARKER_CLASS_NAME,
  CASE_STUDY_CHAPTER_SELECTOR,
  CASE_STUDY_NAV_ARIA_LABEL,
  CASE_STUDY_NAV_LIST_CLASS_NAME,
  CASE_STUDY_NAV_ROOT_CLASS_NAME,
  type CaseStudyChapter,
  activateCaseStudyChapterObserver,
  activateCaseStudyChapterNavigation,
  getCaseStudyChapterAriaCurrent,
  getCaseStudyChapterAriaLabel,
  getCaseStudyChapterIndicatorState,
  getCaseStudyChapterLabelClassName,
  getCaseStudyChapters,
  getInitialCaseStudyChapterId,
} from '@/lib/case-study-nav'

export default function CaseStudyNav() {
  const [chapters, setChapters] = useState<CaseStudyChapter[]>([])
  const [activeChapter, setActiveChapter] = useState('')
  const prefersReducedMotion = useReducedMotion() ?? false
  const haptic = useWebHaptics()

  // Discover chapters from [data-chapter] elements
  useEffect(() => {
    const elements = document.querySelectorAll<HTMLElement>(CASE_STUDY_CHAPTER_SELECTOR)
    const found = getCaseStudyChapters(elements)

    setChapters(found)
    setActiveChapter(getInitialCaseStudyChapterId(found))
  }, [])

  // Track which chapter is in view
  useEffect(() => {
    return activateCaseStudyChapterObserver({
      chapters,
      createObserver: (onEntries, options) => new IntersectionObserver((entries) => onEntries(entries), options),
      getChapterElements: () => document.querySelectorAll(CASE_STUDY_CHAPTER_SELECTOR),
      setActiveChapter,
    })
  }, [chapters])

  if (chapters.length === 0) return null

  return (
    <div className={CASE_STUDY_NAV_ROOT_CLASS_NAME}>
      <nav
        className={CASE_STUDY_NAV_LIST_CLASS_NAME}
        aria-label={CASE_STUDY_NAV_ARIA_LABEL}
      >
        {chapters.map((chapter) => {
          const isActive = chapter.id === activeChapter
          const indicatorState = getCaseStudyChapterIndicatorState(isActive)

          return (
            <button
              key={chapter.id}
              type="button"
              onClick={() =>
                activateCaseStudyChapterNavigation({
                  chapterId: chapter.id,
                  findChapterElement: (selector) => document.querySelector(selector),
                  trackNavigationClick: (target) => analytics.navigationClick(target),
                  triggerHaptic: (style) => haptic.trigger(style),
                })
              }
              className={CASE_STUDY_CHAPTER_BUTTON_CLASS_NAME}
              aria-current={getCaseStudyChapterAriaCurrent(isActive)}
              aria-label={getCaseStudyChapterAriaLabel(chapter)}
            >
              <m.span
                className={CASE_STUDY_CHAPTER_MARKER_CLASS_NAME}
                animate={indicatorState}
                transition={{
                  duration: motionDurationMs(300, prefersReducedMotion),
                  ease: MOTION_EASE_SOFT,
                }}
              />
              <span
                className={getCaseStudyChapterLabelClassName(isActive)}
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
