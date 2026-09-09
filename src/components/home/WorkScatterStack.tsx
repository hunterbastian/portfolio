'use client'

import Image from 'next/image'
import Link from 'next/link'
import type { CSSProperties } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { analytics } from '@/lib/analytics'
import { activateEditorialItem } from '@/lib/editorial-item'
import { showJoyToast } from '@/lib/joy'
import {
  getWorkStackCardStyle,
  getWorkStackCards,
  type WorkStackTone,
} from '@/lib/work-stack'
import type { HomeProject } from '@/lib/home-projects'
import styles from './WorkScatterStack.module.css'

interface WorkScatterStackProps {
  label: string
  projects: HomeProject[]
  tone: WorkStackTone
}

export function WorkScatterStack({ label, projects, tone }: WorkScatterStackProps) {
  const haptic = useWebHaptics()
  const cards = getWorkStackCards(projects, tone)

  if (cards.length === 0) {
    return null
  }

  return (
    <div className={styles.stack} aria-label={`${label} collage`}>
      {cards.map((card) => {
        const layoutStyle = getWorkStackCardStyle(card.layout)
        const style = {
          left: layoutStyle.left,
          top: layoutStyle.top,
          width: layoutStyle.width,
          zIndex: layoutStyle.zIndex,
          aspectRatio: layoutStyle.aspectRatio,
          '--stack-rotate': layoutStyle['--stack-rotate'],
        } satisfies CSSProperties & { '--stack-rotate': string }

        return (
          <Link
            key={card.slug}
            href={card.href}
            className={styles.card}
            style={style}
            aria-label={`Open ${card.title}`}
            onClick={() =>
              activateEditorialItem({
                showToast: showJoyToast,
                title: card.title,
                toastMessage: tone === 'playground' ? 'Opening experiment' : 'Opening project',
                tracking: () => analytics.projectClick(card.slug, card.title),
                triggerHaptic: (hapticStyle) => haptic.trigger(hapticStyle),
              })
            }
          >
            <span className={styles.frame}>
              <Image
                src={card.image}
                alt=""
                fill
                sizes="(max-width: 640px) 42vw, 180px"
                className={styles.media}
              />
            </span>
            <span className={styles.caption}>
              <span className={styles.title}>{card.title}</span>
              <span className={styles.year}>{card.year}</span>
            </span>
          </Link>
        )
      })}
    </div>
  )
}
