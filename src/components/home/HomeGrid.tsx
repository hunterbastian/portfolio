'use client'

import Link from 'next/link'
import { useEffect, useRef, useState, type RefObject } from 'react'
import BlurImage from '@/components/media/BlurImage'
import {
  getHomeGridPieces,
  getHomeGridProjectHref,
  stepHomeGridIndex,
  type HomeGridFilter,
  type HomeGridPiece,
} from '@/lib/home-grid'

interface HomeGridProps {
  active: boolean
  filter: HomeGridFilter
  reducedMotion: boolean | null
  onLightboxChange: (open: boolean) => void
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

function GridVideo({
  active,
  poster,
  reducedMotion,
  src,
}: {
  active: boolean
  poster: string
  reducedMotion: boolean | null
  src: string
}) {
  const ref = useRef<HTMLVideoElement>(null)
  const [inView, setInView] = useState(false)
  const [ready, setReady] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node || !active) return

    const mobile = window.matchMedia('(max-width: 820px)').matches
    const root = mobile ? null : node.closest('.home-grid-scroll')
    const observer = new IntersectionObserver(([entry]) => {
      setInView(Boolean(entry?.isIntersecting))
    }, { root, threshold: 0.45 })
    observer.observe(node)
    return () => observer.disconnect()
  }, [active])

  useEffect(() => {
    const video = ref.current
    if (!video) return

    if (!active || !inView || reducedMotion !== false) {
      video.pause()
      return
    }

    if (!video.getAttribute('src')) video.src = src
    video.muted = true
    const pending = video.play()
    if (pending) pending.catch(() => {})
  }, [active, inView, reducedMotion, src])

  if (reducedMotion !== false) return null

  return (
    <video
      ref={ref}
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

export default function HomeGrid({ active, filter, reducedMotion, onLightboxChange }: HomeGridProps) {
  const pieces = getHomeGridPieces(filter)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const openerRef = useRef<HTMLButtonElement | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)
  const openPiece = openIndex !== null ? pieces[openIndex] ?? null : null

  useEffect(() => {
    if (active) return
    setOpenIndex(null)
    onLightboxChange(false)
  }, [active, onLightboxChange])

  useEffect(() => {
    setOpenIndex(null)
    onLightboxChange(false)
  }, [filter, onLightboxChange])

  useEffect(() => {
    if (openIndex === null) return

    closeRef.current?.focus()
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        close()
        return
      }
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return
      event.preventDefault()
      event.stopPropagation()
      const delta = event.key === 'ArrowRight' ? 1 : -1
      setOpenIndex((current) => current === null ? current : stepHomeGridIndex(current, delta, pieces.length))
    }

    window.addEventListener('keydown', onKeyDown)
    return () => {
      document.body.style.overflow = previous
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [openIndex, pieces.length])

  function close() {
    setOpenIndex(null)
    onLightboxChange(false)
    openerRef.current?.focus()
  }

  function open(index: number, button: HTMLButtonElement) {
    openerRef.current = button
    setOpenIndex(index)
    onLightboxChange(true)
  }

  return (
    <>
      <div className="home-grid-scroll">
        <div className="home-grid">
          {pieces.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className="home-grid-tile"
              aria-label={`${item.title}, ${item.year}`}
              onClick={(event) => open(index, event.currentTarget)}
            >
              <span className="home-grid-media">
                <BlurImage
                  src={item.src}
                  alt=""
                  width={item.width}
                  height={item.height}
                  sizes="(max-width: 820px) 46vw, (max-width: 1280px) 18vw, 14vw"
                  quality={75}
                  draggable={false}
                  fetchPriority={index === 0 ? 'high' : 'low'}
                  loading={index === 0 ? 'eager' : 'lazy'}
                  style={{ width: '100%', height: 'auto' }}
                />
                {item.videoSrc ? (
                  <GridVideo
                    active={active}
                    poster={item.src}
                    reducedMotion={reducedMotion}
                    src={item.videoSrc}
                  />
                ) : null}
                <span className="home-grid-caption">
                  <span>{item.title}</span>
                  <span>{item.year}</span>
                </span>
              </span>
            </button>
          ))}
        </div>
      </div>
      {openPiece ? (
        <HomeGridLightbox
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
    </>
  )
}

function HomeGridLightbox({
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
