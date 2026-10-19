'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  HOME_SHOWCASE_LOCATION,
  HOME_SHOWCASE_ROLE,
  HOME_SHOWCASE_THEME_STORAGE_KEY,
  formatDenverClock,
  getShowcaseBio,
  getShowcaseCaption,
  getShowcaseChrome,
  getShowcaseEndeavors,
  getShowcaseHash,
  getShowcaseIndexFromHash,
  getShowcaseLinks,
  getShowcaseTravelDirection,
  planShowcaseSlideMotion,
  parseShowcaseThemePreference,
  resolveShowcaseTheme,
  type ShowcaseSlide,
  type ShowcaseTheme,
  type ShowcaseThemePreference,
} from '@/lib/home-showcase'
import { siteConfig } from '@/lib/site'

const endeavors = getShowcaseEndeavors()
const links = getShowcaseLinks()
const bio = getShowcaseBio()

interface HomeShowcaseProps {
  className?: string
  slides: ShowcaseSlide[]
}

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState<boolean | null>(null)

  useEffect(() => {
    const media = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(media.matches)
    update()
    media.addEventListener('change', update)
    return () => media.removeEventListener('change', update)
  }, [])

  return reduced
}

function DenverClock() {
  const [label, setLabel] = useState('--:--:--')

  useEffect(() => {
    const tick = () => setLabel(formatDenverClock(new Date()))
    tick()
    const timer = window.setInterval(tick, 1000)
    return () => window.clearInterval(timer)
  }, [])

  return (
    <time className="home-showcase-clock" dateTime={label} suppressHydrationWarning>
      {label}
    </time>
  )
}

function readShowcaseThemePreference(): ShowcaseThemePreference {
  try {
    return parseShowcaseThemePreference(localStorage.getItem(HOME_SHOWCASE_THEME_STORAGE_KEY))
  } catch {
    return 'system'
  }
}

function writeShowcaseThemePreference(theme: ShowcaseTheme) {
  try {
    localStorage.setItem(HOME_SHOWCASE_THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing can reject storage. The choice still applies for this view.
  }
}

function applyHomeShowcaseTheme(theme: ShowcaseTheme) {
  const chrome = getShowcaseChrome(theme === 'dark')
  const root = document.documentElement
  root.dataset.homeShowcase = 'true'
  root.dataset.homeShowcaseTheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', chrome.canvas)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', chrome.colorScheme)
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', chrome.statusBar)
}

function clearHomeShowcaseTheme() {
  const root = document.documentElement
  delete root.dataset.homeShowcase
  delete root.dataset.homeShowcaseTheme

  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', siteConfig.themeColorDark)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark')
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', 'black')
}

function ExternalArrow() {
  return (
    <span className="home-showcase-arrow" aria-hidden="true">
      {'↗\uFE0E'}
    </span>
  )
}

export default function HomeShowcase({ className, slides }: HomeShowcaseProps) {
  const count = slides.length
  const [index, setIndex] = useState(0)
  const [previousIndex, setPreviousIndex] = useState<number | null>(null)
  const [ready, setReady] = useState(false)
  const [seen, setSeen] = useState<ReadonlySet<number>>(() => new Set([0]))
  const [direction, setDirection] = useState<1 | -1>(1)
  const indexRef = useRef(0)
  const panelRef = useRef<HTMLDivElement>(null)
  const motionGeneration = useRef(0)
  const motionRef = useRef<{
    direction: 1 | -1
    next: number
    opacities: number[]
    previous: number
    transforms: string[]
  } | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const suppressClick = useRef(false)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const reducedMotion = usePrefersReducedMotion()
  const [theme, setTheme] = useState<ShowcaseTheme>('light')
  // Null until the pre-paint sync, so SSR does not mark either still as the LCP image.
  const [prioritizedTheme, setPrioritizedTheme] = useState<ShowcaseTheme | null>(null)

  const markSeen = useCallback((nextIndex: number) => {
    setSeen((current) => {
      if (current.has(nextIndex)) return current
      const next = new Set(current)
      next.add(nextIndex)
      return next
    })
  }, [])

  const go = useCallback((nextIndex: number) => {
    if (count < 1) return

    const normalized = (nextIndex % count + count) % count
    const current = indexRef.current
    if (normalized === current) return
    const nextDirection = getShowcaseTravelDirection(current, normalized, count)
    const panel = panelRef.current
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (panel && !reduced) {
      const elements = [...panel.querySelectorAll<HTMLElement>('.home-showcase-slide')]
      motionRef.current = {
        direction: nextDirection,
        next: normalized,
        opacities: elements.map((element) => Number(getComputedStyle(element).opacity) || 0),
        previous: current,
        transforms: elements.map((element) => getComputedStyle(element).transform || 'none'),
      }
    } else {
      motionRef.current = null
    }

    setPreviousIndex(current)
    indexRef.current = normalized
    setDirection(nextDirection)
    setIndex(normalized)
    markSeen(normalized)

    const hash = getShowcaseHash(normalized)
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }
  }, [count, markSeen])

  const chooseTheme = useCallback((next: ShowcaseTheme) => {
    writeShowcaseThemePreference(next)
    applyHomeShowcaseTheme(next)
    setTheme(next)
    setPrioritizedTheme(next)
  }, [])

  useLayoutEffect(() => {
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    const syncChrome = () => {
      const next = resolveShowcaseTheme(readShowcaseThemePreference(), scheme.matches)
      applyHomeShowcaseTheme(next)
      setTheme(next)
      setPrioritizedTheme(next)
    }
    syncChrome()
    scheme.addEventListener('change', syncChrome)

    const nextIndex = getShowcaseIndexFromHash(window.location.hash, count)
    indexRef.current = nextIndex
    setIndex(nextIndex)
    markSeen(nextIndex)

    const hash = getShowcaseHash(nextIndex)
    if (window.location.hash !== hash) {
      window.history.replaceState(null, '', hash)
    }

    setReady(true)

    return () => {
      scheme.removeEventListener('change', syncChrome)
      clearHomeShowcaseTheme()
    }
  }, [count, markSeen])

  useLayoutEffect(() => {
    const motion = motionRef.current
    motionRef.current = null
    const panel = panelRef.current
    if (!motion || !panel) return

    const plan = planShowcaseSlideMotion({
      direction: motion.direction,
      nextIndex: motion.next,
      opacities: motion.opacities,
      previousIndex: motion.previous,
      reduced: false,
      transforms: motion.transforms,
    })
    if (!plan) return

    const elements = [...panel.querySelectorAll<HTMLElement>('.home-showcase-slide')]
    elements.forEach((element) => {
      element.getAnimations().forEach((animation) => animation.cancel())
    })

    const hidden = new Set(plan.hidden)
    elements.forEach((element, elementIndex) => {
      if (!hidden.has(elementIndex)) return
      element.style.opacity = '0'
      element.style.transform = 'none'
      element.style.zIndex = ''
    })

    const options: KeyframeAnimationOptions = {
      duration: plan.duration,
      easing: plan.easing,
      fill: 'both',
    }
    const animations: Animation[] = []
    const hold = (element: HTMLElement | undefined, frames: Keyframe[], zIndex: string) => {
      if (!element) return
      const from = frames[0] ?? {}
      // Hold the captured frame in inline style so a pending animation cannot
      // flash the new slide at full opacity before the first animation frame.
      element.style.opacity = String(from.opacity ?? 0)
      element.style.transform = typeof from.transform === 'string' ? from.transform : 'none'
      element.style.zIndex = zIndex
      animations.push(element.animate(frames, options))
    }
    plan.departures.forEach((departure) => {
      hold(elements[departure.index], departure.keyframes, '0')
    })
    hold(elements[plan.source], plan.exit, '1')
    hold(elements[plan.nextIndex], plan.enter, '2')

    const generation = ++motionGeneration.current
    Promise.all(animations.map((animation) => animation.finished.catch(() => undefined))).then(() => {
      if (generation !== motionGeneration.current) return
      elements.forEach((element) => {
        element.getAnimations().forEach((animation) => animation.cancel())
        element.style.opacity = ''
        element.style.transform = ''
        element.style.zIndex = ''
      })
    })
  }, [index])

  useEffect(() => {
    const onHashChange = () => {
      go(getShowcaseIndexFromHash(window.location.hash, count))
    }

    window.addEventListener('hashchange', onHashChange)
    return () => window.removeEventListener('hashchange', onHashChange)
  }, [count, go])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.altKey || event.metaKey || event.ctrlKey) return

      const target = event.target
      if (target instanceof HTMLElement) {
        const tag = target.tagName
        if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || target.isContentEditable) return
      }

      if (event.key === 'ArrowRight') {
        event.preventDefault()
        go(indexRef.current + 1)
      } else if (event.key === 'ArrowLeft') {
        event.preventDefault()
        go(indexRef.current - 1)
      }
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion !== false || theme !== 'light') return

    video.muted = true
    const pending = video.play()
    if (pending) pending.catch(() => {})
  }, [index, reducedMotion, theme])

  useEffect(() => {
    const slide = slides[index]
    if (!slide || prioritizedTheme === null) return

    const hiddenSrc = prioritizedTheme === 'dark' ? slide.imageSrc : slide.darkImageSrc
    const warm = () => {
      const image = new Image()
      image.decoding = 'async'
      image.fetchPriority = 'low'
      image.src = hiddenSrc
    }

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }

    const id = window.setTimeout(warm, 400)
    return () => window.clearTimeout(id)
  }, [index, prioritizedTheme, slides])

  const active = slides[index]
  const caption = active ? getShowcaseCaption(index, count, active) : null

  return (
    <div className={className ? `home-showcase ${className}` : 'home-showcase'} data-ready={ready ? 'true' : undefined}>
      <aside className="home-showcase-aside">
        <div className="home-showcase-identity">
          <h1>{siteConfig.personName}</h1>
          <p>{HOME_SHOWCASE_ROLE}</p>
          <p className="home-showcase-place">
            <span>{HOME_SHOWCASE_LOCATION}</span>
            <DenverClock />
          </p>
        </div>

        <div className="home-showcase-bottom">
          <p className="home-showcase-bio">{bio}</p>
          <div className="home-showcase-endeavors">
            <p className="home-showcase-label">Endeavors</p>
            <ul className="home-showcase-list">
              {endeavors.map((item) => (
                <li key={item.label}>
                  {item.external ? (
                    <a href={item.href} target="_blank" rel="noopener noreferrer">
                      {item.label} <ExternalArrow />
                    </a>
                  ) : (
                    <Link href={item.href}>
                      {item.label} <ExternalArrow />
                    </Link>
                  )}
                  <span className="home-showcase-mute">{item.meta}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="home-showcase-actions">
            <nav className="home-showcase-links" aria-label="Contact">
              {links.map((item) => item.external ? (
                <a key={item.label} href={item.href} {...(item.href.startsWith('mailto:') ? {} : { target: '_blank', rel: 'noopener noreferrer' })}>
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="home-showcase-theme" role="group" aria-label="Color theme">
              <button type="button" aria-pressed={theme === 'light'} onClick={() => chooseTheme('light')}>
                Light
              </button>
              <span aria-hidden="true">/</span>
              <button type="button" aria-pressed={theme === 'dark'} onClick={() => chooseTheme('dark')}>
                Dark
              </button>
            </div>
          </div>
        </div>
      </aside>

      <section className="home-showcase-stage" aria-label="Selected work">
        <div
          ref={panelRef}
          className="home-showcase-panel"
          aria-roledescription="carousel"
          aria-label="Selected work"
          onTouchStart={(event) => {
            const touch = event.touches[0]
            if (!touch) return
            touchStart.current = { x: touch.clientX, y: touch.clientY }
          }}
          onTouchEnd={(event) => {
            const start = touchStart.current
            const touch = event.changedTouches[0]
            touchStart.current = null
            if (!start || !touch) return

            const deltaX = touch.clientX - start.x
            const deltaY = touch.clientY - start.y
            if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
              suppressClick.current = true
              go(indexRef.current + (deltaX < 0 ? 1 : -1))
            }
          }}
          onClickCapture={(event) => {
            if (!suppressClick.current) return
            event.preventDefault()
            event.stopPropagation()
            suppressClick.current = false
          }}
        >
          {slides.map((slide, slideIndex) => {
            const current = slideIndex === index
            const position = current
              ? 'current'
              : previousIndex !== null && slideIndex === previousIndex
                ? direction > 0 ? 'left' : 'right'
                : slideIndex < index ? 'left' : 'right'
            const showVideo = current && Boolean(slide.videoSrc) && reducedMotion === false && theme === 'light'
            const loaded = current || seen.has(slideIndex)
            const eagerLight = current && prioritizedTheme === 'light'
            const eagerDark = current && prioritizedTheme === 'dark'

            return (
              <div
                key={slide.slug}
                className="home-showcase-slide"
                data-pos={position}
                role="group"
                aria-roledescription="slide"
                aria-label={`${slideIndex + 1} of ${count}: ${slide.title}`}
                aria-hidden={current ? undefined : true}
              >
                <Link
                  href={slide.href}
                  tabIndex={current ? 0 : -1}
                  aria-label={`Open ${slide.title}`}
                >
                  {loaded ? (
                    <span className="home-showcase-frame">
                      {showVideo ? (
                        <video
                          className="home-showcase-motion"
                          ref={videoRef}
                          src={slide.videoSrc ?? undefined}
                          poster={slide.imageSrc}
                          muted
                          autoPlay
                          loop
                          playsInline
                          preload="metadata"
                          aria-hidden="true"
                          tabIndex={-1}
                        />
                      ) : null}
                      <img
                        className="home-showcase-still home-showcase-still-light"
                        src={slide.imageSrc}
                        alt={slide.imageAlt}
                        draggable={false}
                        decoding="async"
                        fetchPriority={eagerLight ? 'high' : 'low'}
                        loading={eagerLight ? 'eager' : 'lazy'}
                      />
                      <img
                        className="home-showcase-still home-showcase-still-dark"
                        src={slide.darkImageSrc}
                        alt=""
                        draggable={false}
                        decoding="async"
                        fetchPriority={eagerDark ? 'high' : 'low'}
                        loading={eagerDark ? 'eager' : 'lazy'}
                      />
                    </span>
                  ) : null}
                </Link>
              </div>
            )
          })}
        </div>

        {active ? (
          <div className="home-showcase-bar">
            <p className="home-showcase-caption" aria-live="polite">
              {caption?.lead}
              <span className="home-showcase-mute"> · {caption?.tag}</span>
            </p>
            <div className="home-showcase-dots" role="group" aria-label="Choose a project">
              {slides.map((slide, slideIndex) => (
                <button
                  key={slide.slug}
                  type="button"
                  className="home-showcase-dot"
                  aria-label={`Show ${slide.title}`}
                  aria-current={slideIndex === index ? 'true' : undefined}
                  onClick={() => go(slideIndex)}
                />
              ))}
            </div>
            <div className="home-showcase-controls">
              <button type="button" aria-label="Previous project" onClick={() => go(indexRef.current - 1)}>
                Prev
              </button>
              <button type="button" aria-label="Next project" onClick={() => go(indexRef.current + 1)}>
                Next
              </button>
            </div>
          </div>
        ) : null}
      </section>
    </div>
  )
}
