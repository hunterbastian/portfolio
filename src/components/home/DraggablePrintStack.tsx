'use client'

import Image from 'next/image'
import { useId, useRef, useState } from 'react'
import type { CSSProperties, PointerEvent } from 'react'
import { ArrowLeft, ArrowRight, ArrowUpRight } from 'lucide-react'
import { studioWork } from '@/content/studio-work'
import styles from './DraggablePrintStack.module.css'

const prints = studioWork['Studio Alpine']
const SWIPE_DISTANCE = 48

export function DraggablePrintStack() {
  const id = useId()
  const [index, setIndex] = useState(0)
  const [hasInteracted, setHasInteracted] = useState(false)
  const [offset, setOffset] = useState({ x: 0, y: 0, dragging: false })
  const gesture = useRef<{ pointerId: number; x: number; y: number; moved: boolean } | null>(null)
  const suppressClick = useRef(false)
  const current = prints[index]

  function select(next: number) {
    setHasInteracted(true)
    setIndex((next + prints.length) % prints.length)
    setOffset({ x: 0, y: 0, dragging: false })
  }

  function startDrag(event: PointerEvent<HTMLButtonElement>) {
    if (!event.isPrimary || event.button !== 0) return
    suppressClick.current = false
    gesture.current = { pointerId: event.pointerId, x: event.clientX, y: event.clientY, moved: false }
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function moveDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current
    if (!start || start.pointerId !== event.pointerId) return
    const x = event.clientX - start.x
    const y = event.clientY - start.y
    if (Math.abs(x) > 6) start.moved = true
    if (!start.moved) return
    const stageWidth = event.currentTarget.parentElement?.clientWidth ?? 320
    const limit = Math.max(24, Math.min(96, (stageWidth - event.currentTarget.offsetWidth) / 2 - 24))
    setOffset({ x: Math.max(-limit, Math.min(limit, x)), y: Math.max(-16, Math.min(16, y)), dragging: true })
  }

  function finishDrag(event: PointerEvent<HTMLButtonElement>) {
    const start = gesture.current
    if (!start || start.pointerId !== event.pointerId) return
    const distance = event.clientX - start.x
    suppressClick.current = start.moved
    gesture.current = null
    if (start.moved && Math.abs(distance) >= SWIPE_DISTANCE) {
      select(index + (distance < 0 ? 1 : -1))
    } else {
      setOffset({ x: 0, y: 0, dragging: false })
    }
    if (event.currentTarget.hasPointerCapture(event.pointerId)) event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function cancelDrag() {
    suppressClick.current = Boolean(gesture.current?.moved)
    gesture.current = null
    setOffset({ x: 0, y: 0, dragging: false })
  }

  const style = {
    '--print-x': `${offset.x}px`,
    '--print-y': `${offset.y}px`,
    '--print-angle': `${-2 + offset.x / 24}deg`,
  } as CSSProperties

  return (
    <section className={styles.root} aria-labelledby={`${id}-title`}>
      <div className={styles.heading}>
        <h3 id={`${id}-title`}>Print studies</h3>
        <span>Studio Alpine</span>
      </div>
      <div className={styles.stage} role="group" aria-roledescription="carousel" aria-label="Studio Alpine print stack">
        {[2, 1].map((depth) => {
          const print = prints[(index + depth) % prints.length]
          return (
            <span key={depth} className={`${styles.print} ${styles.back}`} data-depth={depth} aria-hidden="true">
              <span className={styles.imageFrame}>
                <Image src={print.image} alt="" fill sizes="(max-width: 639px) 46vw, 220px" draggable={false} />
              </span>
            </span>
          )
        })}
        <button
          type="button"
          className={`${styles.print} ${styles.front}`}
          data-dragging={offset.dragging || undefined}
          data-switched={hasInteracted || undefined}
          style={style}
          aria-label={`Show next print. Current: ${current.title}, ${index + 1} of ${prints.length}`}
          aria-describedby={`${id}-hint`}
          onPointerDown={startDrag}
          onPointerMove={moveDrag}
          onPointerUp={finishDrag}
          onPointerCancel={cancelDrag}
          onLostPointerCapture={() => { if (gesture.current) cancelDrag() }}
          onDragStart={(event) => event.preventDefault()}
          onClick={(event) => {
            if (event.detail > 0 && suppressClick.current) {
              suppressClick.current = false
              return
            }
            select(index + 1)
          }}
          onKeyDown={(event) => {
            if (event.key === 'Escape') { cancelDrag(); return }
            if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return
            event.preventDefault()
            select(event.key === 'Home' ? 0 : event.key === 'End' ? prints.length - 1 : index + (event.key === 'ArrowRight' ? 1 : -1))
          }}
        >
          <span className={styles.imageFrame} key={current.image}>
            <Image src={current.image} alt={current.alt} fill sizes="(max-width: 639px) 46vw, 220px" draggable={false} />
          </span>
          <span className={styles.printNumber} aria-hidden="true">{String(index + 1).padStart(2, '0')} / Studio Alpine</span>
        </button>
      </div>
      <div className={styles.controls}>
        <button type="button" aria-label="Previous print" onClick={() => select(index - 1)}><ArrowLeft size={16} strokeWidth={1.5} aria-hidden="true" /></button>
        <p aria-live="polite" aria-atomic="true"><span>{current.title}</span><span className={styles.counter}>{index + 1} / {prints.length}</span></p>
        <button type="button" aria-label="Next print" onClick={() => select(index + 1)}><ArrowRight size={16} strokeWidth={1.5} aria-hidden="true" /></button>
      </div>
      <div className={styles.note}>
        <p id={`${id}-hint`}>Drag sideways, tap a print, or use the arrows.</p>
        <a href={current.href}>View study <ArrowUpRight size={12} strokeWidth={1.5} aria-hidden="true" /></a>
      </div>
      <p className={styles.type}>{current.type}</p>
    </section>
  )
}
