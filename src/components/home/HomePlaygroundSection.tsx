'use client'

import Image from 'next/image'
import { useRef, useState } from 'react'
import styles from './HomePlaygroundSection.module.css'

const pieces = [
  { slug: 'alpine-sunset', title: 'Alpine sunset' },
  { slug: 'alpine-daylight', title: 'Alpine daylight' },
  { slug: 'alpine-moonlight', title: 'Alpine moonlight' },
]

export function HomePlaygroundSection() {
  const [expanded, setExpanded] = useState(false)
  const [selected, setSelected] = useState(0)
  const dialog = useRef<HTMLDialogElement>(null)
  const trigger = useRef<HTMLButtonElement | null>(null)
  function open(index: number, button: HTMLButtonElement) {
    setSelected(index)
    trigger.current = button
    dialog.current?.showModal()
  }
  return (
    <section id="playground" aria-labelledby="playground-heading" className={styles.section}>
      <h2 id="playground-heading" className="text-sm font-medium">Playground</h2>
      <p className={styles.hint}>A few experiments. Hover or tap to explore.</p>
      <button type="button" className={styles.toggle} aria-expanded={expanded} aria-controls="playground-pieces" onClick={() => setExpanded(!expanded)}>{expanded ? 'Close stack' : 'Explore pieces'}</button>
      <div id="playground-pieces" className={styles.stack} data-expanded={expanded}>
        {pieces.map((piece, index) => (
          <button type="button" key={piece.slug} className={styles.piece} aria-label={`View ${piece.title}`} onClick={(event) => {
            if (window.matchMedia('(hover: none)').matches && !expanded) { setExpanded(true); return }
            open(index, event.currentTarget)
          }}>
            <Image src={`/images/playground/${piece.slug}.png`} alt={piece.title + ' lakeside artwork'} width={1254} height={1254} sizes="(max-width: 640px) 55vw, 300px" draggable={false} />
          </button>
        ))}
      </div>
      <dialog ref={dialog} className={styles.dialog} aria-label={pieces[selected].title} onClose={() => trigger.current?.focus()} onClick={(event) => { if (event.target === event.currentTarget) dialog.current?.close() }}>
        <div className={styles.viewer}>
          <button type="button" autoFocus className={styles.close} onClick={() => dialog.current?.close()} aria-label="Close artwork">Close ×</button>
          <Image src={`/images/playground/${pieces[selected].slug}.png`} alt={pieces[selected].title + ' lakeside artwork'} width={1254} height={1254} sizes="90vw" />
          <p>{pieces[selected].title}</p>
        </div>
      </dialog>
    </section>
  )
}
