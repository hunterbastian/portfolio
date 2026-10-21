'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type RefObject } from 'react'
import BlurImage from '@/components/media/BlurImage'
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
  reducedMotion,
  src,
}: {
  poster: string
  reducedMotion: boolean | null
  src: string
}) {
  const [node, setNode] = useState<HTMLVideoElement | null>(null)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!node) return
    const root = node.closest('.home-work-strip-scroller')
    const observer = new IntersectionObserver(([entry]) => {
      setInView(Boolean(entry?.isIntersecting))
    }, { root, threshold: 0.6 })
    observer.observe(node)
    return () => {
      observer.disconnect()
      setInView(false)
    }
  }, [node])

  useEffect(() => {
    if (!node) return
    if (!inView || reducedMotion !== false) {
      node.pause()
      return
    }
    if (!node.getAttribute('src')) node.src = src
    node.muted = true
    const pending = node.play()
    if (pending) pending.catch(() => {})
  }, [inView, node, reducedMotion, src])

  if (reducedMotion !== false) return null

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

export default function HomeWorkStrip({
  activeSlug,
  reducedMotion,
  onLightboxChange,
  onSelectShowcase,
}: HomeWorkStripProps) {
  const pieces = HOME_GRID_PIECES
  const scrollerRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const drag = useRef<{ pointerId: number; x: number; left: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const [dragging, setDragging] = useState(false)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [atStart, setAtStart] = useState(true)
  const [atEnd, setAtEnd] = useState(false)
  const openPiece = openIndex !== null ? pieces[openIndex] ?? null : null

  useEffect(() => {
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
  }, [])

  useEffect(() => {
    const node = scrollerRef.current
    if (!node) return
    const onWheel = (event: WheelEvent) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.deltaY === 0) return
      node.scrollLeft += event.deltaY
      event.preventDefault()
    }
    node.addEventListener('wheel', onWheel, { passive: false })
    return () => node.removeEventListener('wheel', onWheel)
  }, [])

  useEffect(() => {
    const node = scrollerRef.current
    if (!node || !activeSlug) return
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
  }, [activeSlug])

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

  function scrollByDirection(direction: 1 | -1) {
    const node = scrollerRef.current
    if (!node) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    node.scrollBy({
      left: direction * Math.max(160, node.clientWidth * 0.72),
      behavior: reduced ? 'auto' : 'smooth',
    })
  }

  return (
    <div className="home-work-strip">
      <div className="home-work-strip-head">
        <p className="home-showcase-label">
          All work <span className="home-showcase-mute">{pieces.length}</span>
        </p>
        <div className="home-work-strip-nav">
          <button type="button" aria-label="Previous pieces" disabled={atStart} onClick={() => scrollByDirection(-1)}>
            ‹
          </button>
          <button type="button" aria-label="Next pieces" disabled={atEnd} onClick={() => scrollByDirection(1)}>
            ›
          </button>
        </div>
      </div>
      <div
        ref={scrollerRef}
        className={dragging ? 'home-work-strip-scroller is-dragging' : 'home-work-strip-scroller'}
        data-start={atStart ? 'true' : undefined}
        data-end={atEnd ? 'true' : undefined}
        onPointerDown={(event) => {
          if (event.pointerType === 'touch' || event.button !== 0) return
          const node = scrollerRef.current
          if (!node) return
          drag.current = { pointerId: event.pointerId, x: event.clientX, left: node.scrollLeft, moved: false }
          setDragging(true)
          node.setPointerCapture(event.pointerId)
        }}
        onPointerMove={(event) => {
          const state = drag.current
          const node = scrollerRef.current
          if (!state || !node || state.pointerId !== event.pointerId) return
          const delta = event.clientX - state.x
          if (Math.abs(delta) > 4) state.moved = true
          node.scrollLeft = state.left - delta
        }}
        onPointerUp={(event) => {
          const state = drag.current
          if (!state || state.pointerId !== event.pointerId) return
          if (state.moved) suppressClick.current = true
          drag.current = null
          setDragging(false)
        }}
        onPointerCancel={() => {
          drag.current = null
          setDragging(false)
        }}
        onClickCapture={(event) => {
          if (!suppressClick.current) return
          event.preventDefault()
          event.stopPropagation()
          suppressClick.current = false
        }}
      >
        {pieces.map((item, index) => {
          const current = workStripMatchesSlide(item, activeSlug)
          return (
            <button
              key={item.id}
              type="button"
              className="home-work-strip-item"
              aria-label={`${item.title}, ${item.year}`}
              aria-current={current ? 'true' : undefined}
              onClick={(event) => {
                const action = getWorkStripAction(item)
                if (action.type === 'showcase') {
                  onSelectShowcase(action.index)
                  return
                }
                openLightbox(index, event.currentTarget)
              }}
            >
              <span className="home-work-strip-media">
                <BlurImage
                  src={item.src}
                  alt=""
                  fill
                  sizes="(max-width: 820px) 42vw, 180px"
                  quality={70}
                  draggable={false}
                  fetchPriority={index < 2 ? 'high' : 'low'}
                  loading={index < 6 ? 'eager' : 'lazy'}
                  style={{ objectFit: 'cover' }}
                />
                {item.videoSrc ? (
                  <StripVideo poster={item.src} reducedMotion={reducedMotion} src={item.videoSrc} />
                ) : null}
                <span className="home-work-strip-caption">
                  <span>{item.title}</span>
                  <span>{item.year}</span>
                </span>
              </span>
            </button>
          )
        })}
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
