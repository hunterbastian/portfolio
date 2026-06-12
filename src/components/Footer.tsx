'use client'

import { useEffect, useRef, useState } from 'react'
import type { RefObject } from 'react'
import { usePathname } from 'next/navigation'
import { Summer as PixelSun } from '@/components/pixel/glyphs'
import {
  FOOTER_COPYRIGHT_CLASS,
  FOOTER_INNER_CLASS,
  FOOTER_MADE_LABEL,
  FOOTER_MADE_LINE_CLASS,
  FOOTER_META_ROW_CLASS,
  FOOTER_PIXEL_SUN_SHELL_CLASS,
  FOOTER_REVEAL_OBSERVER_THRESHOLD,
  activateFooterSparkle,
  getFooterClassName,
  getFooterCopyrightLabel,
  getFooterSparkleClassName,
  subscribeFooterVisibility,
  shouldActivateFooterSparkle,
} from '@/lib/footer'

function useHideOnScroll() {
  const [hidden, setHidden] = useState(false)
  const lastScrollY = useRef(0)

  useEffect(() => {
    return subscribeFooterVisibility({
      addEventListener: (type, listener, options) => window.addEventListener(type, listener, options),
      cancelAnimationFrame: (frame: number) => window.cancelAnimationFrame(frame),
      documentElement: document.documentElement,
      getLastScrollY: () => lastScrollY.current,
      removeEventListener: (type, listener) => window.removeEventListener(type, listener),
      requestAnimationFrame: (callback) => window.requestAnimationFrame(callback),
      setHidden,
      setLastScrollY: (scrollY) => {
        lastScrollY.current = scrollY
      },
      viewport: window,
    })
  }, [])

  return hidden
}

function useSparkleOnReveal(targetRef: RefObject<HTMLElement | null>) {
  const [active, setActive] = useState(false)
  const hasFiredRef = useRef(false)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    const node = targetRef.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!shouldActivateFooterSparkle({
          hasFired: hasFiredRef.current,
          isIntersecting: entry?.isIntersecting,
        })) {
          return
        }

        activateFooterSparkle({
          markFired: () => {
            hasFiredRef.current = true
          },
          scheduleDeactivate: (durationMs) => {
            timerRef.current = setTimeout(() => setActive(false), durationMs)
          },
          setActive,
        })
      },
      { threshold: FOOTER_REVEAL_OBSERVER_THRESHOLD },
    )

    observer.observe(node)
    return () => {
      observer.disconnect()
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [targetRef])

  return active
}

export default function Footer() {
  const pathname = usePathname()
  const footerRef = useRef<HTMLElement | null>(null)
  const hidden = useHideOnScroll()
  const sparkleActive = useSparkleOnReveal(footerRef)
  const currentYear = new Date().getFullYear()

  return (
    <footer
      ref={footerRef}
      className={getFooterClassName(pathname, hidden)}
    >
      <div className={FOOTER_INNER_CLASS}>
        <div className={FOOTER_META_ROW_CLASS}>
          <p className={FOOTER_COPYRIGHT_CLASS}>
            {getFooterCopyrightLabel(currentYear)}
          </p>
          <p className={FOOTER_MADE_LINE_CLASS}>
            <span aria-hidden="true" className={FOOTER_PIXEL_SUN_SHELL_CLASS}>
              <span
                className={getFooterSparkleClassName(sparkleActive)}
              >
                <PixelSun size={11} />
              </span>
            </span>
            <span>{FOOTER_MADE_LABEL}</span>
          </p>
        </div>
      </div>
    </footer>
  )
}
