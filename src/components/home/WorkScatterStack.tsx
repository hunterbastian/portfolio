'use client'

import Image from 'next/image'
import { useSyncExternalStore, type CSSProperties } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import MorphLink from '@/components/MorphLink'
import { analytics } from '@/lib/analytics'
import { activateEditorialItem } from '@/lib/editorial-item'
import { showJoyToast } from '@/lib/joy'
import { getProjectCardImageZoomStyle } from '@/lib/project-card'
import {
  getProjectMorphProps,
  getProjectMorphServerSnapshot,
  getProjectMorphSlug,
  subscribeProjectMorph,
} from '@/lib/view-transition'
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
  const morphSlug = useSyncExternalStore(
    subscribeProjectMorph,
    getProjectMorphSlug,
    getProjectMorphServerSnapshot,
  )

  if (cards.length === 0) {
    return null
  }

  return (
    <div className={styles.stack} aria-label={`${label} collage`}>
      {cards.map((card) => {
        const { style: morphStyle, ...morphAttributes } = getProjectMorphProps(card.slug, morphSlug)
        const style = { ...getWorkStackCardStyle(card.layout), ...morphStyle } as CSSProperties

        return (
          <MorphLink
            key={card.slug}
            href={card.href}
            slug={card.slug}
            className={styles.card}
            style={style}
            aria-label={`Open ${card.title}`}
            {...morphAttributes}
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
            <Image
              src={card.image}
              alt=""
              fill
              sizes="(max-width: 640px) 48vw, 180px"
              className={styles.media}
              style={getProjectCardImageZoomStyle(card.imageZoom)}
            />
          </MorphLink>
        )
      })}
    </div>
  )
}
