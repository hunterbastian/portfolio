'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import ProjectCard from '@/components/ProjectCard'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import type { Project } from '@/types/project'

interface PlaygroundOrbitProps {
  projects: Project[]
  radiusDesktop?: number
  radiusLarge?: number
}

const NORMAL_SPEED = 0.018
const SLOW_SPEED = 0.0035
const DEFAULT_ORBIT_RADIUS_DESKTOP = 300
const DEFAULT_ORBIT_RADIUS_LARGE = 360

const ENTRANCE = {
  centerDelay: 0.24,
  cardsDelay: 0.38,
  cardStagger: 0.1,
  cardDuration: 0.58,
  ease: MOTION_EASE_SOFT,
}

function cardTilt(index: number) {
  return ((index % 3) - 1) * 3
}

function useOrbitRadius(radiusDesktop: number, radiusLarge: number) {
  const [radius, setRadius] = useState(radiusDesktop)

  useEffect(() => {
    function update() {
      const widthRadius = window.innerWidth >= 1280 ? radiusLarge : radiusDesktop
      const viewportHeight = window.visualViewport?.height ?? window.innerHeight
      const heightRadius = viewportHeight < 780 ? 198 : viewportHeight < 860 ? 214 : widthRadius

      setRadius(Math.min(widthRadius, heightRadius))
    }
    update()
    window.addEventListener('resize', update)
    window.visualViewport?.addEventListener('resize', update)
    return () => {
      window.removeEventListener('resize', update)
      window.visualViewport?.removeEventListener('resize', update)
    }
  }, [radiusDesktop, radiusLarge])

  return radius
}

function getOrbitCardSize(count: number) {
  if (count >= 9) return 112
  if (count >= 7) return 120
  if (count >= 5) return 132
  return 144
}

function CenterLabel() {
  return (
    <m.div
      className="flex flex-col items-center text-center"
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.48, delay: ENTRANCE.centerDelay, ease: ENTRANCE.ease }}
    >
      <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/50">
        <span className="font-medium">Playground</span>
      </p>
    </m.div>
  )
}

function MobilePlayground({ projects }: PlaygroundOrbitProps) {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <div className="flex flex-col items-center md:hidden">
      <m.div
        className="mb-6 text-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.48, delay: 0.1, ease: ENTRANCE.ease }}
      >
        <p className="font-mono text-[11px] uppercase tracking-[0.14em] text-muted-foreground/50">
          Playground
        </p>
      </m.div>

      <div className="grid w-full max-w-[20.5rem] grid-cols-1 gap-y-5 pb-5 pt-1 sm:max-w-none sm:grid-cols-2 sm:gap-x-3">
        {projects.map((project, index) => {
          const tilt = cardTilt(index)

          return (
            <m.div
              key={project.slug}
              className="min-w-0"
              style={{ transform: `rotate(${tilt}deg)` }}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16, filter: 'blur(6px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              transition={{
                duration: ENTRANCE.cardDuration,
                delay: ENTRANCE.cardsDelay + index * ENTRANCE.cardStagger,
                ease: ENTRANCE.ease,
              }}
            >
              <ProjectCard
                slug={project.slug}
                frontmatter={project.frontmatter}
                index={index}
                priorityImage={index < 4}
              />
            </m.div>
          )
        })}
      </div>
    </div>
  )
}

function OrbitCard({
  project,
  index,
  baseAngle,
  tilt,
  isHovered,
  hasHoverTarget,
  rotation,
  orbitRadius,
  cardSize,
  prefersReducedMotion,
  onHoverStart,
  onHoverEnd,
}: {
  project: Project
  index: number
  baseAngle: number
  tilt: number
  isHovered: boolean
  hasHoverTarget: boolean
  rotation: ReturnType<typeof useMotionValue<number>>
  orbitRadius: number
  cardSize: number
  prefersReducedMotion: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  const x = useTransform(rotation, (r) => {
    const rad = ((baseAngle + r) * Math.PI) / 180
    return Math.sin(rad) * orbitRadius
  })
  const y = useTransform(rotation, (r) => {
    const rad = ((baseAngle + r) * Math.PI) / 180
    return -Math.cos(rad) * orbitRadius
  })
  const depth = useTransform(rotation, (r) => {
    const rad = ((baseAngle + r) * Math.PI) / 180
    return (1 - Math.cos(rad)) / 2
  })
  const cardScale = useTransform(depth, (value) => 0.88 + value * 0.12)
  const cardOpacity = useTransform(depth, (value) => 0.58 + value * 0.42)
  const cardBrightness = useTransform(depth, (value) => 0.82 + value * 0.18)
  const zIndex = useTransform(depth, (value) => 1 + Math.round(value * 20))

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
        zIndex: isHovered ? 40 : zIndex,
      }}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{
        duration: ENTRANCE.cardDuration,
        delay: ENTRANCE.cardsDelay + index * ENTRANCE.cardStagger,
        ease: ENTRANCE.ease,
      }}
    >
      <m.div
        className="will-change-transform transition-[filter,transform] duration-700 ease-soft"
        style={{
          rotate: tilt,
          scale: isHovered ? 1.2 : 1,
          filter: hasHoverTarget && !isHovered
            ? 'brightness(0.78) saturate(0.62)'
            : isHovered
              ? 'brightness(1.12) saturate(1.08) contrast(1.03)'
              : cardBrightness,
        }}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
        onFocus={onHoverStart}
        onBlur={(event) => {
          const nextTarget = event.relatedTarget instanceof Node ? event.relatedTarget : null
          if (!event.currentTarget.contains(nextTarget)) {
            onHoverEnd()
          }
        }}
      >
        <ProjectCard
          slug={project.slug}
          frontmatter={project.frontmatter}
          index={index}
          hideLiveBadge
          hideLabel
          priorityImage={index < 4}
        />
        <AnimatePresence initial={false}>
          {isHovered && (
            <m.div
              className="mt-1 text-center"
              initial={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -4, filter: 'blur(4px)' }}
              transition={{ duration: 0.2, ease: ENTRANCE.ease }}
            >
              <p className="truncate font-mono text-[9px] tracking-[0.06em] text-muted-foreground/50">
                {project.frontmatter.title}
              </p>
            </m.div>
          )}
        </AnimatePresence>
      </m.div>
    </m.div>
  )
}

export default function PlaygroundOrbit({
  projects,
  radiusDesktop = DEFAULT_ORBIT_RADIUS_DESKTOP,
  radiusLarge = DEFAULT_ORBIT_RADIUS_LARGE,
}: PlaygroundOrbitProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [orbitActive, setOrbitActive] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const count = projects.length
  const rotation = useMotionValue(0)
  const speedRef = useRef(0)
  const orbitRadius = useOrbitRadius(radiusDesktop, radiusLarge)
  const cardSize = getOrbitCardSize(count)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const entranceDuration = (ENTRANCE.cardsDelay + count * ENTRANCE.cardStagger + ENTRANCE.cardDuration) * 1000
    const timer = setTimeout(() => setOrbitActive(true), entranceDuration)
    return () => clearTimeout(timer)
  }, [count])

  useAnimationFrame(() => {
    if (prefersReducedMotion) return
    const target = !orbitActive ? 0 : hoveredIndex !== null ? SLOW_SPEED : NORMAL_SPEED
    speedRef.current += (target - speedRef.current) * 0.04
    if (Math.abs(speedRef.current) > 0.0001) {
      rotation.set((rotation.get() + speedRef.current) % 360)
    }
  })

  const handleHoverStart = useCallback((index: number) => setHoveredIndex(index), [])
  const handleHoverEnd = useCallback(() => setHoveredIndex(null), [])

  return (
    <div className="h-full">
      <MobilePlayground projects={projects} />

      <div className="relative hidden h-full md:block">
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <CenterLabel />
        </div>

        {mounted
          ? projects.map((project, index) => {
              const baseAngle = (index / count) * 360
              const tilt = cardTilt(index)
              const isHovered = hoveredIndex === index

              return (
                <OrbitCard
                  key={project.slug}
                  project={project}
                  index={index}
                  baseAngle={baseAngle}
                  tilt={tilt}
                  isHovered={isHovered}
                  hasHoverTarget={hoveredIndex !== null}
                  rotation={rotation}
                  orbitRadius={orbitRadius}
                  cardSize={cardSize}
                  prefersReducedMotion={prefersReducedMotion}
                  onHoverStart={() => handleHoverStart(index)}
                  onHoverEnd={handleHoverEnd}
                />
              )
            })
          : null}
      </div>
    </div>
  )
}
