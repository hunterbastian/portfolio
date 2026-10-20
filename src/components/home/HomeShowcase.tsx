'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import BlurImage from '@/components/media/BlurImage'
import EmailCopyLink from '@/components/showcase/EmailCopyLink'
import ShowcaseThemeSwitch from '@/components/showcase/ShowcaseThemeSwitch'
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
  getShowcaseKeyboardAction,
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
  const [videoGate, setVideoGate] = useState({ index: 0, ready: false })
  if (videoGate.index !== index) {
    setVideoGate({ index, ready: false })
  }
  const videoReady = videoGate.ready && videoGate.index === index
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
      const action = getShowcaseKeyboardAction({
        altKey: event.altKey,
        ctrlKey: event.ctrlKey,
        key: event.key,
        metaKey: event.metaKey,
        shiftKey: event.shiftKey,
        target: event.target instanceof HTMLElement
          ? { isContentEditable: event.target.isContentEditable, tagName: event.target.tagName }
          : null,
      })
      if (!action) return

      event.preventDefault()
      go(indexRef.current + (action === 'next' ? 1 : -1))
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [go])

  useEffect(() => {
    const video = videoRef.current
    if (!video || reducedMotion !== false) return

    video.muted = true
    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      setVideoGate({ index, ready: true })
    }
    const pending = video.play()
    if (pending) pending.catch(() => {})
  }, [index, reducedMotion])

  useEffect(() => {
    const next = slides[(index + 1) % count]
    if (!next) return

    const warm = () => {
      const image = new Image()
      image.decoding = 'async'
      image.fetchPriority = 'low'
      image.src = next.imageSrc
    }

    if (typeof window.requestIdleCallback === 'function') {
      const id = window.requestIdleCallback(warm, { timeout: 1500 })
      return () => window.cancelIdleCallback(id)
    }

    const id = window.setTimeout(warm, 400)
    return () => window.clearTimeout(id)
  }, [count, index, slides])

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
              {links.map((item) => item.href.startsWith('mailto:') ? (
                <EmailCopyLink key={item.label} href={item.href}>
                  {item.label}
                </EmailCopyLink>
              ) : item.external ? (
                <a key={item.label} href={item.href} target="_blank" rel="noopener noreferrer">
                  {item.label}
                </a>
              ) : (
                <Link key={item.label} href={item.href}>
                  {item.label}
                </Link>
              ))}
            </nav>
            <ShowcaseThemeSwitch className="home-showcase-theme" theme={theme} onChange={chooseTheme} />
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
            const showVideo = current && Boolean(slide.videoSrc) && reducedMotion === false
            const loaded = current || seen.has(slideIndex)
            const eager = current && prioritizedTheme !== null

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
                    <span className="home-showcase-device">
                      <span className="home-showcase-screen">
                        {showVideo ? (
                          <video
                            className="home-showcase-motion"
                            ref={videoRef}
                            poster={slide.imageSrc}
                            muted
                            autoPlay
                            loop
                            playsInline
                            preload="auto"
                            aria-hidden="true"
                            tabIndex={-1}
                            data-ready={videoReady ? 'true' : undefined}
                            onLoadedData={() => setVideoGate({ index, ready: true })}
                            onPlaying={() => setVideoGate({ index, ready: true })}
                          >
                            {slide.videoWebmSrc ? <source src={slide.videoWebmSrc} type="video/webm" /> : null}
                            {slide.videoSrc ? <source src={slide.videoSrc} type="video/mp4" /> : null}
                          </video>
                        ) : null}
                        <BlurImage
                          className="home-showcase-still"
                          src={slide.imageSrc}
                          alt={slide.imageAlt}
                          fill
                          sizes="(max-width: 820px) calc(100vw - 64px), 920px"
                          draggable={false}
                          quality={80}
                          style={{ objectFit: 'cover' }}
                          fetchPriority={eager ? 'high' : 'low'}
                          loading={eager ? 'eager' : 'lazy'}
                        />
                      </span>
                      <span className="home-showcase-glass" aria-hidden="true" />
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
