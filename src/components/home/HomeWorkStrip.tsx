'use client'

import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useRef, useState, type PointerEvent as ReactPointerEvent, type RefObject } from 'react'
import BlurImage from '@/components/media/BlurImage'
import { useBodyScrollLock } from '@/lib/use-body-scroll-lock'
import {
  HOME_GRID_PIECES,
  getHomeGridProjectHref,
  getWorkStripAction,
  stepHomeGridIndex,
  workStripMatchesSlide,
  type HomeGridPiece,
} from '@/lib/home-grid'

interface HomeWorkStripProps {
  activeSlug: string | null
  reducedMotion: boolean | null
  onLightboxChange: (open: boolean) => void
  onSelectShowcase: (index: number) => void
}

const DESKTOP_CYCLE_SECONDS = 50
const MOBILE_CYCLE_SECONDS = 60

function wrapOffset(offset: number, width: number) {
  if (!(width > 0)) return 0
  const wrapped = offset % width
  return wrapped > 0 ? wrapped - width : wrapped
}

function pageCanScrollY() {
  const body = getComputedStyle(document.body)
  if (body.overflowY === 'hidden' || body.overflow === 'hidden') return false
  return document.documentElement.scrollHeight > document.documentElement.clientHeight + 1
}

function LightboxVideo({ poster, src }: { poster: string; src: string }) {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const video = ref.current
    if (!video) return
    video.muted = true
    const pending = video.play()
    if (pending) pending.catch(() => {})
  }, [src])

  return <video ref={ref} src={src} poster={poster} muted autoPlay loop playsInline />
}

function StripVideo({
  poster,
  src,
}: {
  poster: string
  src: string
}) {
  const [node, setNode] = useState<HTMLVideoElement | null>(null)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!node) return
    const root = node.closest('.home-work-strip-frame')
    const observer = new IntersectionObserver(([entry]) => {
      setInView(Boolean(entry?.isIntersecting))
    }, { root: root instanceof Element ? root : null, threshold: 0.6 })
    observer.observe(node)
    return () => {
      observer.disconnect()
      setInView(false)
    }
  }, [node])

  useEffect(() => {
    if (!node) return
    if (!inView) {
      node.pause()
      return
    }
    if (!node.getAttribute('src')) node.src = src
    node.muted = true
    const pending = node.play()
    if (pending) pending.catch(() => {})
  }, [inView, node, src])

  return (
    <video
      ref={setNode}
      poster={poster}
      muted
      loop
      playsInline
      preload="none"
      aria-hidden="true"
      data-ready={ready ? 'true' : undefined}
      onPlaying={() => setReady(true)}
    />
  )
}

function StripPiece({
  active,
  copy,
  index,
  item,
  showVideo,
  onOpen,
}: {
  active: boolean
  copy: boolean
  index: number
  item: HomeGridPiece
  showVideo: boolean
  onOpen: (item: HomeGridPiece, index: number, button: HTMLButtonElement) => void
}) {
  const ref = useRef<HTMLButtonElement>(null)
  const [near, setNear] = useState(!copy && index < 6)

  useEffect(() => {
    const node = ref.current
    if (!node || near) return
    const root = node.closest('.home-work-strip-frame')
    const observer = new IntersectionObserver(([entry]) => {
      if (entry?.isIntersecting) setNear(true)
    }, { root: root instanceof Element ? root : null, rootMargin: '280px', threshold: 0 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [near])

  return (
    <button
      ref={ref}
      type="button"
      className={active ? 'home-work-strip-item is-active' : 'home-work-strip-item'}
      aria-label={`${item.title}, ${item.year}`}
      aria-current={!copy && active ? 'true' : undefined}
      aria-hidden={copy ? true : undefined}
      tabIndex={copy ? -1 : undefined}
      onClick={(event) => onOpen(item, index, event.currentTarget)}
    >
      <span className="home-work-strip-media">
        {near ? (
          <BlurImage
            src={item.src}
            alt=""
            fill
            sizes="84px"
            quality={60}
            draggable={false}
            loading={index < 6 && !copy ? 'eager' : 'lazy'}
            style={{ objectFit: 'cover' }}
          />
        ) : null}
        {near && showVideo && item.videoSrc ? (
          <StripVideo poster={item.src} src={item.videoSrc} />
        ) : null}
        <span className="home-work-strip-caption">
          <span>{item.title}</span>
          <span>{item.year}</span>
        </span>
      </span>
    </button>
  )
}

function EdgeFade({ side }: { side: 'left' | 'right' }) {
  return (
    <div className={`home-work-strip-edge is-${side}`} aria-hidden="true">
      <span />
      <span />
      <span />
      <span />
      <span className="is-fade" />
    </div>
  )
}

export default function HomeWorkStrip({
  activeSlug,
  reducedMotion,
  onLightboxChange,
  onSelectShowcase,
}: HomeWorkStripProps) {
  const pieces = HOME_GRID_PIECES
  const marquee = reducedMotion === false
  const frameRef = useRef<HTMLDivElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const offsetRef = useRef(0)
  const setWidthRef = useRef(0)
  const cycleRef = useRef(DESKTOP_CYCLE_SECONDS)
  const hoverRef = useRef(false)
  const focusRef = useRef(false)
  const dragPausedRef = useRef(false)
  const hiddenRef = useRef(false)
  const offscreenRef = useRef(true)
  const nudgeRef = useRef(false)
  const kickRef = useRef<() => void>(() => {})
  const drag = useRef<{
    pointerId: number
    x: number
    y: number
    left: number
    moved: boolean
    axis: 'x' | 'y' | null
  } | null>(null)
  const suppressClick = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [compact, setCompact] = useState(true)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const openPiece = openIndex !== null ? pieces[openIndex] ?? null : null
  useBodyScrollLock(openIndex !== null)
  const showVideo = marquee && !compact

  const applyOffset = useCallback(() => {
    const track = trackRef.current
    if (!track) return
    const next = wrapOffset(offsetRef.current, setWidthRef.current)
    offsetRef.current = next
    track.style.transform = `translate3d(${next}px,0,0)`
  }, [])

  useEffect(() => {
    const query = window.matchMedia('(max-width: 820px)')
    const sync = () => setCompact(query.matches)
    sync()
    query.addEventListener('change', sync)
    return () => query.removeEventListener('change', sync)
  }, [])

  useEffect(() => {
    if (marquee) return
    const node = scrollerRef.current
    if (!node) return
    const sync = () => {
      setAtStart(node.scrollLeft <= 1)
      setAtEnd(node.scrollLeft + node.clientWidth >= node.scrollWidth - 1)
    }
    sync()
    node.addEventListener('scroll', sync, { passive: true })
    const observer = new ResizeObserver(sync)
    observer.observe(node)
    return () => {
      node.removeEventListener('scroll', sync)
      observer.disconnect()
    }
  }, [marquee])

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return
    const onWheel = (event: WheelEvent) => {
      const horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY)
      if (!horizontal && event.deltaY === 0) return
      if (marquee) {
        if (!horizontal && pageCanScrollY() && !event.shiftKey) return
        event.preventDefault()
        const delta = horizontal ? event.deltaX : event.deltaY
        offsetRef.current -= delta
        applyOffset()
        return
      }
      if (horizontal || event.deltaY === 0) return
      const max = node.scrollWidth - node.clientWidth
      const atBound = event.deltaY < 0 ? node.scrollLeft <= 1 : node.scrollLeft >= max - 1
      if (atBound) return
      node.scrollLeft += event.deltaY
      event.preventDefault()
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [applyOffset, marquee])

  useEffect(() => {
    if (!marquee) return
    const frame = frameRef.current
    const track = trackRef.current
    if (!frame || !track) return

    let raf = 0
    let last = performance.now()
    let alive = true

    const measure = () => {
      const real = track.querySelector<HTMLElement>('[data-set="real"]')
      const dup = track.querySelector<HTMLElement>('[data-set="dup"]')
      if (!real || !dup) return
      const width = dup.offsetLeft - real.offsetLeft
      if (width > 0) setWidthRef.current = width
      cycleRef.current = window.matchMedia('(max-width: 820px)').matches ? MOBILE_CYCLE_SECONDS : DESKTOP_CYCLE_SECONDS
    }

    const paused = () => hoverRef.current || focusRef.current || dragPausedRef.current || hiddenRef.current || offscreenRef.current || nudgeRef.current

    const tick = (now: number) => {
      if (!alive) return
      const dt = Math.min(0.05, (now - last) / 1000)
      last = now
      const width = setWidthRef.current
      if (!paused() && width > 0) {
        offsetRef.current -= (width / cycleRef.current) * dt
        applyOffset()
        raf = requestAnimationFrame(tick)
        return
      }
      raf = 0
    }

    const kick = () => {
      if (!alive || raf || paused()) return
      last = performance.now()
      raf = requestAnimationFrame(tick)
    }
    kickRef.current = kick

    measure()
    applyOffset()

    const resize = new ResizeObserver(() => {
      measure()
      applyOffset()
    })
    resize.observe(track)
    resize.observe(frame)

    const onVisibility = () => {
      hiddenRef.current = document.hidden
      if (!document.hidden) kick()
    }
    hiddenRef.current = document.hidden
    document.addEventListener('visibilitychange', onVisibility)

    const intersection = new IntersectionObserver(([entry]) => {
      offscreenRef.current = !entry?.isIntersecting
      if (entry?.isIntersecting) kick()
    }, { threshold: 0.15 })
    offscreenRef.current = true
    intersection.observe(frame)

    return () => {
      alive = false
      kickRef.current = () => {}
      cancelAnimationFrame(raf)
      resize.disconnect()
      document.removeEventListener('visibilitychange', onVisibility)
      intersection.disconnect()
    }
  }, [applyOffset, marquee])

  useLayoutEffect(() => {
    if (!marquee || !activeSlug) return
    const frame = frameRef.current
    const track = trackRef.current
    if (!frame || !track) return
    const real = track.querySelector<HTMLElement>('[data-set="real"]')
    const dup = track.querySelector<HTMLElement>('[data-set="dup"]')
    if (!real) return
    if (dup) {
      const width = dup.offsetLeft - real.offsetLeft
      if (width > 0) setWidthRef.current = width
    }
    const matches = [...real.querySelectorAll<HTMLElement>('.is-active')]
    if (matches.length === 0) return
    const frameBox = frame.getBoundingClientRect()
    const visible = matches.some((item) => {
      const box = item.getBoundingClientRect()
      return box.right > frameBox.left + 8 && box.left < frameBox.right - 8
    })
    if (visible) return
    const box = matches[0].getBoundingClientRect()
    offsetRef.current -= box.left - frameBox.left - 8
    applyOffset()
  }, [activeSlug, applyOffset, marquee])

  useEffect(() => {
    if (marquee || !activeSlug) return
    const node = scrollerRef.current
    if (!node) return
    const matches = [...node.querySelectorAll<HTMLElement>('[aria-current="true"]')]
    const first = matches[0]
    if (!first) return
    const box = node.getBoundingClientRect()
    const visible = matches.some((item) => {
      const itemBox = item.getBoundingClientRect()
      return itemBox.right > box.left + 12 && itemBox.left < box.right - 12
    })
    if (visible) return
    const left = first.getBoundingClientRect().left - box.left + node.scrollLeft
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollTo({ left: Math.max(0, left - 12), behavior: reduced ? 'auto' : 'smooth' })
  }, [activeSlug, marquee])

  useEffect(() => {
    if (openIndex === null) return
    closeRef.current?.focus()
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      const delta = event.key === 'ArrowRight' ? 1 : -1
      setOpenIndex((current) => current === null ? current : stepHomeGridIndex(current, delta, pieces.length))
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [openIndex, pieces.length])

  function close() {
    setOpenIndex(null)
    onLightboxChange(false)
    openerRef.current?.focus()
  }

  function openLightbox(index: number, button: HTMLButtonElement) {
    openerRef.current = button
    setOpenIndex(index)
    onLightboxChange(true)
  }

  function openPieceAction(item: HomeGridPiece, index: number, button: HTMLButtonElement) {
    const action = getWorkStripAction(item)
    if (action.type === 'showcase') {
      onSelectShowcase(action.index)
      return
    }
    openLightbox(index, button)
  }

  function nudge(direction: 1 | -1) {
    const node = scrollerRef.current
    if (!node) return
    if (!marquee) {
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      node.scrollBy({
        left: direction * Math.max(160, node.clientWidth * 0.72),
        behavior: reduced ? 'auto' : 'smooth',
      })
      return
    }
    const distance = direction * Math.max(160, node.clientWidth * 0.72)
    const from = offsetRef.current
    const to = from - distance
    const start = performance.now()
    nudgeRef.current = true
    const step = (now: number) => {
      const t = Math.min(1, (now - start) / 420)
      const eased = 1 - (1 - t) ** 3
      offsetRef.current = from + (to - from) * eased
      applyOffset()
      if (t < 1) {
        requestAnimationFrame(step)
        return
      }
      nudgeRef.current = false
      kickRef.current()
    }
    requestAnimationFrame(step)
  }

  function onPointerDown(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return
    const node = scrollerRef.current
    if (!node) return
    if (!marquee && event.pointerType === 'touch') return
    if (marquee) dragPausedRef.current = true
    drag.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      left: marquee ? offsetRef.current : node.scrollLeft,
      moved: false,
      axis: null,
    }
    if (!marquee) {
      setDragging(true)
      node.setPointerCapture(event.pointerId)
    }
  }

  function onPointerMove(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current
    const node = scrollerRef.current
    if (!state || !node || state.pointerId !== event.pointerId || state.axis === 'y') return
    const deltaX = event.clientX - state.x
    const deltaY = event.clientY - state.y
    if (!state.axis) {
      if (Math.abs(deltaX) < 4 && Math.abs(deltaY) < 4) return
      state.axis = Math.abs(deltaY) > Math.abs(deltaX) ? 'y' : 'x'
      if (state.axis === 'y') return
      state.moved = true
      dragPausedRef.current = true
      setDragging(true)
      if (marquee) node.setPointerCapture(event.pointerId)
    }
    if (marquee) {
      offsetRef.current = state.left + deltaX
      applyOffset()
      return
    }
    node.scrollLeft = state.left - deltaX
  }

  function endDrag(event: ReactPointerEvent<HTMLDivElement>) {
    const state = drag.current
    if (!state || state.pointerId !== event.pointerId) return
    if (state.moved) suppressClick.current = true
    drag.current = null
    dragPausedRef.current = false
    setDragging(false)
    kickRef.current()
  }

  return (
    <div
      className="home-work-strip"
      onPointerEnter={(event) => {
        if (event.pointerType === 'touch') return
        hoverRef.current = true
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === 'touch') return
        hoverRef.current = false
        kickRef.current()
      }}
      onFocusCapture={() => {
        focusRef.current = true
      }}
      onBlurCapture={(event) => {
        const next = event.relatedTarget
        if (!(next instanceof Node) || !event.currentTarget.contains(next)) {
          focusRef.current = false
          kickRef.current()
        }
      }}
    >
      <div className="home-work-strip-head">
        <p className="home-showcase-label">
          All work <span className="home-showcase-mute">{pieces.length}</span>
        </p>
        <div className="home-work-strip-nav">
          <button type="button" aria-label="Previous pieces" disabled={!marquee && atStart} onClick={() => nudge(-1)}>
            ‹
          </button>
          <button type="button" aria-label="Next pieces" disabled={!marquee && atEnd} onClick={() => nudge(1)}>
            ›
          </button>
        </div>
      </div>
      <div className="home-work-strip-frame" ref={frameRef} data-marquee={marquee ? 'true' : 'false'}>
        <div
          ref={scrollerRef}
          className={dragging
            ? `home-work-strip-scroller is-dragging ${marquee ? 'is-marquee' : 'is-static'}`
            : `home-work-strip-scroller ${marquee ? 'is-marquee' : 'is-static'}`}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerCancel={endDrag}
          onClickCapture={(event) => {
            if (!suppressClick.current) return
            event.preventDefault()
            event.stopPropagation()
            suppressClick.current = false
          }}
        >
          <div ref={trackRef} className={marquee ? 'home-work-strip-track is-marquee' : 'home-work-strip-track'}>
            <div className="home-work-strip-set" data-set="real">
              {pieces.map((item, index) => (
                <StripPiece
                  key={item.id}
                  active={workStripMatchesSlide(item, activeSlug)}
                  copy={false}
                  index={index}
                  item={item}
                  showVideo={showVideo}
                  onOpen={openPieceAction}
                />
              ))}
            </div>
            {marquee ? (
              <div className="home-work-strip-set" data-set="dup" aria-hidden="true">
                {pieces.map((item, index) => (
                  <StripPiece
                    key={`${item.id}-copy`}
                    active={workStripMatchesSlide(item, activeSlug)}
                    copy
                    index={index}
                    item={item}
                    showVideo={showVideo}
                    onOpen={openPieceAction}
                  />
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <EdgeFade side="left" />
        <EdgeFade side="right" />
      </div>
      {openPiece ? (
        <WorkStripLightbox
          closeRef={closeRef}
          count={pieces.length}
          index={openIndex ?? 0}
          piece={openPiece}
          reducedMotion={reducedMotion}
          onClose={close}
          onStep={(delta) => setOpenIndex((current) => current === null ? current : stepHomeGridIndex(current, delta, pieces.length))}
          onTouchStart={(point) => {
            touchStart.current = point
          }}
          onTouchEnd={(point) => {
            const start = touchStart.current
            touchStart.current = null
            if (!start) return
            const deltaX = point.x - start.x
            const deltaY = point.y - start.y
            if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
              setOpenIndex((current) => current === null ? current : stepHomeGridIndex(current, deltaX < 0 ? 1 : -1, pieces.length))
            }
          }}
        />
      ) : null}
    </div>
  )
}

function WorkStripLightbox({
  closeRef,
  count,
  index,
  onClose,
  onStep,
  onTouchEnd,
  onTouchStart,
  piece,
  reducedMotion,
}: {
  closeRef: RefObject<HTMLButtonElement | null>
  count: number
  index: number
  onClose: () => void
  onStep: (delta: number) => void
  onTouchEnd: (point: { x: number; y: number }) => void
  onTouchStart: (point: { x: number; y: number }) => void
  piece: HomeGridPiece
  reducedMotion: boolean | null
}) {
  const href = getHomeGridProjectHref(piece)

  return (
    <div
      className="home-grid-lightbox"
      role="dialog"
      aria-modal="true"
      aria-label={`${piece.title}, ${piece.year}`}
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose()
      }}
      onTouchStart={(event) => {
        const touch = event.touches[0]
        if (!touch) return
        onTouchStart({ x: touch.clientX, y: touch.clientY })
      }}
      onTouchEnd={(event) => {
        const touch = event.changedTouches[0]
        if (!touch) return
        onTouchEnd({ x: touch.clientX, y: touch.clientY })
      }}
    >
      <button ref={closeRef} type="button" className="home-grid-lightbox-close" onClick={onClose}>
        Close
      </button>
      <button type="button" className="home-grid-lightbox-nav is-prev" aria-label="Previous piece" onClick={() => onStep(-1)}>
        ‹
      </button>
      <figure className="home-grid-lightbox-figure">
        <span className="home-grid-lightbox-media">
          {piece.videoSrc && reducedMotion === false ? (
            <LightboxVideo poster={piece.src} src={piece.videoSrc} />
          ) : (
            <BlurImage
              src={piece.src}
              alt=""
              width={piece.width}
              height={piece.height}
              sizes="92vw"
              quality={80}
              style={{ width: 'auto', height: 'auto', maxWidth: 'min(92vw, 1100px)', maxHeight: '78vh', objectFit: 'contain' }}
            />
          )}
        </span>
        <figcaption>
          <span>{piece.title}</span>
          <span className="home-showcase-mute">{piece.year}</span>
          <span className="home-showcase-mute">{index + 1} / {count}</span>
          {href ? <Link href={href}>Open project</Link> : null}
        </figcaption>
      </figure>
      <button type="button" className="home-grid-lightbox-nav is-next" aria-label="Next piece" onClick={() => onStep(1)}>
        ›
      </button>
    </div>
  )
}
