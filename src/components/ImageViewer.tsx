'use client'

import BlurImage from '@/components/media/BlurImage'
import type { ReactNode } from 'react'
import { Expand } from 'lucide-react'
import * as Modal from '@/components/alignui/modal'
import { cn } from '@/lib/utils'
import styles from '@/components/alignui/controls.module.css'

export default function ImageViewer({ src, alt, children, className, preview }: {
  src: string
  alt: string
  children: ReactNode
  className?: string
  /** Replaces the raw image inside the modal. Cropped media passes the same window, enlarged. */
  preview?: ReactNode
}) {
  const title = alt || 'Project image'

  return (
    <Modal.Root>
      <Modal.Trigger asChild>
        <button type="button" className={cn(styles.imageTrigger, className)} aria-label={`Enlarge image: ${title}`}>
          {children}
          <span className={styles.imageExpand} aria-hidden="true"><Expand size={16} />View</span>
        </button>
      </Modal.Trigger>
      <Modal.Content>
        <Modal.Title className={styles.imageTitle}>{title}</Modal.Title>
        <Modal.Description className="sr-only">Enlarged project image. Press Escape or use the close button to return.</Modal.Description>
        <div className={styles.imageCanvas}>
          {preview ?? (
            <BlurImage src={src} alt={alt} fill sizes="(max-width: 1279px) calc(100vw - 64px), 1168px" className="object-contain" quality={90} style={{ objectFit: 'contain' }} />
          )}
        </div>
      </Modal.Content>
    </Modal.Root>
  )
}
