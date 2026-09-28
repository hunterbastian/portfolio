'use client'

import Image from 'next/image'
import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { studioWork } from '@/content/studio-work'
import styles from './DraggablePrintStack.module.css'

const prints = studioWork['Studio Alpine']
const SWIPE_DISTANCE = 48
const EXIT_DURATION = 180

type Gesture = { pointerId: number; x: number; y: number; moved: boolean; card: HTMLButtonElement }
type LeavingPrint = { index: number; direction: number; distance: number }

export function DraggablePrintStack() {
  const id = useId()
  const [index, setIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0, dragging: false })
  const [leaving, setLeaving] = useState<LeavingPrint | null>(null)
  const indexRef = useRef(0)
  const stageRef = useRef<HTMLDivElement>(null)
  const cards = useRef<Array<HTMLButtonElement | null>>([])
  const gesture = useRef<Gesture | null>(null)
  const suppressClick = useRef(false)
  const restoreFocus = useRef(false)
  const exitTimer = useRef<ReturnType<typeof setTimeout> | null>(null)
  const current = prints[index]

  useEffect(() => () => {
    if (exitTimer.current) clearTimeout(exitTimer.current)
  }, [])

  useLayoutEffect(() => {
    if (restoreFocus.current) {
      cards.current[index]?.focus({ preventScroll: true })
      restoreFocus.current = false
    }
  }, [index])

  function releaseGesture() {
    const start = gesture.current
    gesture.current = null
    if (start?.card.hasPointerCapture(start.pointerId)) start.card.releasePointerCapture(start.pointerId)
  }

  function select(next: number, direction = -1) {
    const previous = indexRef.current
    const selected = (next + prints.length) % prints.length
    releaseGesture()
    setOffset({ x: 0, y: 0, dragging: false })
    if (selected === previous) return
    if (exitTimer.current) clearTimeout(exitTimer.current)

    restoreFocus.current = document.activeElement === cards.current[previous]
    if (restoreFocus.current) cards.current[previous]?.blur()
    indexRef.current = selected
    setIndex(selected)
    setHasInteracted(true)

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setLeaving(null)
      return
    }

    const stageWidth = stageRef.current?.clientWidth ?? 320
    setLeaving({ index: previous, direction, distance: Math.min(160, stageWidth * 0.36) })
    exitTimer.current = setTimeout(() => {
      setLeaving(null)
      exitTimer.current = null
    }, EXIT_DURATION)
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>, printIndex: number) {
    if (indexRef.current !== printIndex || !event.isPrimary || event.button !== 0) return
    suppressClick.current = false
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false, card: event.currentTarget }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current
    if (!start || start.pointerId !== event.pointerId) return
    const x = event.clientX - start.x
    const y = event.clientY - start.y

    if (!start.moved) {
      // Commit only to a horizontal gesture; leave vertical swipes to page scrolling.
      if (Math.abs(y) > 8 && Math.abs(y) > Math.abs(x)) {
        suppressClick.current = true
        releaseGesture()
        return
      }
      if (Math.abs(x) < 8 || Math.abs(x) <= Math.abs(y)) return
      start.moved = true
    }

    const limit = Math.min(130, (stageRef.current?.clientWidth ?? 320) * 0.36)
    setOffset({ x: Math.max(-limit, Math.min(limit, x)), y: Math.max(-20, Math.min(20, y * 0.4)), dragging: true })
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current
    if (!start || start.pointerId !== event.pointerId) return
    const distance = event.clientX - start.x
    suppressClick.current = start.moved
    releaseGesture()
    if (start.moved && Math.abs(distance) >= SWIPE_DISTANCE) {
      const direction = distance < 0 ? -1 : 1
      select(indexRef.current - direction, direction)
    } else {
      setOffset({ x: 0, y: 0, dragging: false })
    }
  }

  function cancelDrag() {
    if (!gesture.current) return
    suppressClick.current = true
    releaseGesture()
    setOffset({ x: 0, y: 0, dragging: false })
  }

  return (
    <section className={styles.root} aria-labelledby={`${id}-title`}>
      <div className={styles.heading}>
        <h3 id={`${id}-title`}>Selected prints</h3>
        <span>Studio Alpine</span>
      </div>
      <div ref={stageRef} className={styles.stage} role="group" aria-roledescription="carousel" aria-label="Studio Alpine print stack">
        {prints.map((print, printIndex) => {
          const depth = (printIndex - index + prints.length) % prints.length
          const front = depth === 0
          const exiting = leaving?.index === printIndex
          const dragging = front && offset.dragging
          const style = {
            '--print-x': `${exiting ? leaving.direction * leaving.distance : front ? offset.x : depth === 1 ? 16 : -14}px`,
            '--print-y': `${exiting ? -14 : front ? offset.y - (dragging ? 8 : 0) : depth === 1 ? 5 : 10}px`,
            '--print-angle': `${exiting ? leaving.direction * 8 : front ? -1 + offset.x / 42 : depth === 1 ? 4.5 : -5.5}deg`,
            '--print-scale': dragging ? 1.015 : front || exiting ? 1 : 1 - depth * 0.015,
            zIndex: exiting ? prints.length + 1 : prints.length - depth,
          } as CSSProperties

          return (
            <button
              key={print.image}
              ref={(element) => { cards.current[printIndex] = element }}
              type="button"
              className={styles.print}
              data-front={front || undefined}
              data-depth={depth}
              data-dragging={dragging || undefined}
              data-leaving={exiting || undefined}
              style={style}
              tabIndex={front ? 0 : -1}
              aria-hidden={front ? undefined : true}
              aria-label={front ? `Show next print. Current: ${print.title}, ${index + 1} of ${prints.length}` : undefined}
              aria-describedby={front ? `${id}-hint` : undefined}
              onPointerDown={(event) => startDrag(event, printIndex)}
              onPointerMove={moveDrag}
              onPointerUp={finishDrag}
              onPointerCancel={cancelDrag}
              onLostPointerCapture={cancelDrag}
              onDragStart={(event) => event.preventDefault()}
              onClick={(event) => {
                if (event.detail > 0 && suppressClick.current) {
                  suppressClick.current = false
                  return
                }
                if (indexRef.current === printIndex) select(indexRef.current + 1)
              }}
              onKeyDown={(event) => {
                if (event.key === 'Escape') { cancelDrag(); return }
                if (!front || !['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
                event.preventDefault()
                const next = event.key === 'Home' ? 0 : event.key === 'End' ? prints.length - 1 : indexRef.current + (event.key === 'ArrowRight' ? 1 : -1)
                select(next, event.key === 'ArrowLeft' || event.key === 'Home' ? 1 : -1)
              }}
            >
              <span className={styles.imageFrame}>
                <Image src={print.image} alt={front ? print.alt : ''} fill sizes="(max-width: 380px) 60vw, 236px" draggable={false} />
              </span>
              <span className={styles.printNumber} aria-hidden="true">{String(printIndex + 1).padStart(2, '0')} / Studio Alpine</span>
            </button>
          )
        })}
      </div>
      <div className={styles.controls}>
        <button type="button" aria-label="Previous print" onClick={() => select(indexRef.current - 1, 1)}><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /></button>
        <div className={styles.caption} aria-live="polite" aria-atomic="true">
          <div key={index} className={styles.captionCopy} data-switched={hasInteracted || undefined}>
            <p className={styles.title}>{current.title}</p>
            <span className={styles.counter}>{String(index + 1).padStart(2, '0')} / {String(prints.length).padStart(2, '0')}</span>
            <p className={styles.type}>{current.type}</p>
          </div>
        </div>
        <button type="button" aria-label="Next print" onClick={() => select(indexRef.current + 1)}><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></button>
      </div>
      <div className={styles.note}>
        <p id={`${id}-hint`}>Drag or tap to browse.<span className="sr-only"> Use the left and right arrow keys to change prints, or Home and End to jump to the first and last.</span></p>
        <a href={current.href}>View study <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" /></a>
      </div>
    </section>
  )
}
