'use client'

import Image from 'next/image'
import { Dialog } from '@base-ui/react/dialog'
import type { CSSProperties } from 'react'
import { ArrowUpRight, X } from 'lucide-react'
import type { StudioWorkExample } from '@/content/studio-work'
import styles from './StudioWorkStack.module.css'

export function StudioWorkStack({ studio, examples, print }: {
  studio: string
  examples: StudioWorkExample[]
  print: boolean
}) {
  return (
    <Dialog.Root>
      <Dialog.Trigger className={styles.trigger} aria-label={`View ${studio} work`}>
        <span className={styles.stack} aria-hidden="true">
          {examples.map((example, index) => (
            <span key={example.title} className={`${styles.card} ${print ? styles.print : ''}`}
              style={{ '--index': index, '--offset': index - (examples.length - 1) / 2, zIndex: examples.length - index } as CSSProperties}>
              <Image src={example.image} alt="" fill sizes="80px" className={styles.thumbnail} />
            </span>
          ))}
        </span>
        <span className={styles.hint}>View work <ArrowUpRight size={12} aria-hidden="true" /></span>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Backdrop className={styles.backdrop} />
        <Dialog.Popup className={styles.gallery}>
          <div className={styles.header}>
            <div>
              <Dialog.Title className={styles.title}>{studio}</Dialog.Title>
              <Dialog.Description className={styles.description}>
                {print ? 'Selected visual studies' : 'Selected website concepts'}
              </Dialog.Description>
            </div>
            <Dialog.Close className={styles.close} aria-label={`Close ${studio} gallery`}><X size={20} /></Dialog.Close>
          </div>
          <div className={styles.grid}>
            {examples.map((example) => (
              <a key={example.title} href={example.href} className={styles.example}
                {...(example.href.startsWith('https:') ? { target: '_blank', rel: 'noopener noreferrer' } : {})}>
                <div className={`${styles.imageFrame} ${print ? styles.printFrame : ''}`}>
                  <Image src={example.image} alt={example.alt} fill sizes="(max-width: 600px) 85vw, 320px" className={styles.fullImage} />
                </div>
                <span className={styles.caption}>{example.title}<ArrowUpRight size={16} aria-hidden="true" /></span>
                <span className={styles.description}>{example.type}</span>
              </a>
            ))}
          </div>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
