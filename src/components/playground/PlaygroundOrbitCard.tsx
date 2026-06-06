'use client'

import { AnimatePresence, m, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import {
  getPlaygroundMotionInitial,
  getPlaygroundOrbitCardEntranceMotion,
  getPlaygroundOrbitCardEntranceTransition,
  getPlaygroundOrbitCardFrame,
  getPlaygroundOrbitCardHoverScale,
  getPlaygroundOrbitCardInnerClassName,
  getPlaygroundOrbitCardZIndex,
  getPlaygroundOrbitInteractionFilter,
  getPlaygroundOrbitQuickSwapTransition,
  getPlaygroundOrbitVerticalSwapMotion,
  shouldClearPlaygroundHoverOnBlur,
} from '@/lib/playground'
import type { PlaygroundOrbitCardState } from '@/lib/playground'

interface PlaygroundOrbitCardProps {
  displayState: PlaygroundOrbitCardState
  hasHoverTarget: boolean
  rotation: MotionValue<number>
  orbitRadius: number
  cardSize: number
  prefersReducedMotion: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}

export function PlaygroundOrbitCard({
  displayState,
  hasHoverTarget,
  rotation,
  orbitRadius,
  cardSize,
  prefersReducedMotion,
  onHoverStart,
  onHoverEnd,
}: PlaygroundOrbitCardProps) {
  const { baseAngle, index, isHovered, meta, priorityImage, project, tilt } = displayState
  const cardFrame = useTransform(rotation, (r) => getPlaygroundOrbitCardFrame({ baseAngle, orbitRadius, rotation: r }))
  const x = useTransform(cardFrame, (frame) => frame.x)
  const y = useTransform(cardFrame, (frame) => frame.y)
  const cardScale = useTransform(cardFrame, (frame) => frame.scale)
  const cardOpacity = useTransform(cardFrame, (frame) => frame.opacity)
  const cardRestFilter = useTransform(cardFrame, (frame) => frame.filter)
  const zIndex = useTransform(cardFrame, (frame) => frame.zIndex)
  const entranceMotion = getPlaygroundOrbitCardEntranceMotion()
  const calloutMotion = getPlaygroundOrbitVerticalSwapMotion({ initialY: -4, exitY: -4 })

  return (
    <m.div
      className="absolute will-change-transform"
      style={{
        left: '50%',
        top: '50%',
        x,
        y,
        width: cardSize,
        marginLeft: -cardSize / 2,
        marginTop: -cardSize / 2,
        scale: cardScale,
        opacity: cardOpacity,
        zIndex: getPlaygroundOrbitCardZIndex(isHovered, zIndex),
      }}
      initial={getPlaygroundMotionInitial(prefersReducedMotion, entranceMotion.initial)}
      animate={entranceMotion.animate}
      transition={getPlaygroundOrbitCardEntranceTransition(index)}
    >
      <m.div
        className={getPlaygroundOrbitCardInnerClassName(prefersReducedMotion)}
        style={{
          rotate: tilt,
          scale: getPlaygroundOrbitCardHoverScale(isHovered),
          filter: getPlaygroundOrbitInteractionFilter({
            hasHoverTarget,
            isHovered,
            restFilter: cardRestFilter,
          }),
        }}
      >
        <div
          className="playground-orbit-card-shell"
          onMouseEnter={onHoverStart}
          onMouseLeave={onHoverEnd}
          onFocus={onHoverStart}
          onBlur={(event) => {
            const nextTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null
            if (shouldClearPlaygroundHoverOnBlur(event.currentTarget, nextTarget)) {
              onHoverEnd()
            }
          }}
        >
          <div className="playground-orbit-card-meta" aria-hidden="true">
            <span>{meta.routeCode}</span>
            <span>{meta.year}</span>
          </div>
          <ProjectCard
            slug={project.slug}
            frontmatter={project.frontmatter}
            index={index}
            hideLiveBadge
            hideLabel
            priorityImage={priorityImage}
          />
        </div>
        <AnimatePresence initial={false}>
          {isHovered && (
            <m.div
              className="playground-orbit-callout"
              initial={calloutMotion.initial}
              animate={calloutMotion.animate}
              exit={calloutMotion.exit}
              transition={getPlaygroundOrbitQuickSwapTransition()}
            >
              <p className="truncate">{meta.title}</p>
              <span>{meta.category}</span>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </m.div>
  )
}
