'use client'

import { AnimatePresence, m } from 'framer-motion'
import { Radar } from 'lucide-react'
import {
  getPlaygroundOrbitCenterEntranceMotion,
  getPlaygroundOrbitCenterEntranceTransition,
  getPlaygroundOrbitQuickSwapTransition,
  getPlaygroundOrbitVerticalSwapMotion,
} from '@/lib/playground'
import type { PlaygroundCenterHubState } from '@/lib/playground'

interface PlaygroundCenterHubProps {
  hub: PlaygroundCenterHubState
}

export function PlaygroundCenterHub({ hub }: PlaygroundCenterHubProps) {
  const entranceMotion = getPlaygroundOrbitCenterEntranceMotion()
  const contentMotion = getPlaygroundOrbitVerticalSwapMotion({ initialY: 5, exitY: -5 })

  return (
    <m.div
      className="playground-center-hub"
      initial={entranceMotion.initial}
      animate={entranceMotion.animate}
      transition={getPlaygroundOrbitCenterEntranceTransition()}
    >
      <div className="playground-center-eyebrow">
        <span className="playground-center-icon" aria-hidden="true">
          <Radar size={13} strokeWidth={1.7} />
        </span>
        <span>Active route</span>
      </div>

      <AnimatePresence mode="wait" initial={false}>
        <m.div
          key={hub.contentKey}
          className="min-w-0"
          initial={contentMotion.initial}
          animate={contentMotion.animate}
          exit={contentMotion.exit}
          transition={getPlaygroundOrbitQuickSwapTransition()}
        >
          <p className="playground-center-title">{hub.meta.title}</p>
          <div className="playground-center-meta">
            <span>{hub.meta.routeCode}</span>
            <span>{hub.meta.year}</span>
            <span>{hub.meta.position}</span>
          </div>
          <p className="playground-center-copy">{hub.meta.category}</p>
        </m.div>
      </AnimatePresence>
    </m.div>
  )
}
