'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, m, useMotionValue, useTransform, useAnimationFrame, useReducedMotion } from 'framer-motion'
import type { Project } from '@/types/project'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import ProjectCard from '@/components/ProjectCard'

interface PlaygroundOrbitProps {
  projects: Project[]
  radiusDesktop?: number
  radiusLarge?: number
}

const NORMAL_SPEED = 0.018
const SLOW_SPEED = 0.0035
const DEFAULT_ORBIT_RADIUS_DESKTOP = 300
const DEFAULT_ORBIT_RADIUS_LARGE = 360

/* ─────────────────────────────────────────────────────────
 * ENTRANCE STORYBOARD
 *
 *    0ms   waiting for mount
 *  300ms   center label fades in from blur
 *  600ms   cards begin staggered reveal (120ms each)
 *          each card: blur(6px) + scale(0.8) → clear + scale(1)
 *  ~2.4s   orbit rotation begins smoothly
 * ───────────────────────────────────────────────────────── */

const ENTRANCE = {
  centerDelay: 0.3,
  cardsDelay: 0.6,
  cardStagger: 0.12,
  cardDuration: 0.7,
  ease: MOTION_EASE_SOFT,
}

/** Tilts alternate between -3°, 0°, 3° for a subtle scattered feel */
function cardTilt(index: number) {
  return ((index % 3) - 1) * 3
}

/** Responsive orbit radius */
function useOrbitRadius(radiusDesktop: number, radiusLarge: number) {
  const [radius, setRadius] = useState(radiusDesktop)

  useEffect(() => {
    function update() {
      setRadius(window.innerWidth >= 1280 ? radiusLarge : radiusDesktop)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
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
      className="text-center flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.5, delay: ENTRANCE.centerDelay, ease: ENTRANCE.ease }}
    >
      <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground/50">
        <span className="font-medium">Playground</span>
      </p>
    </m.div>
  )
}

function MobilePlayground({ projects }: PlaygroundOrbitProps) {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <div className="flex h-full flex-col items-center justify-center md:hidden">
      <m.div
        className="mb-8 text-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        transition={{ duration: 0.5, delay: 0.1, ease: ENTRANCE.ease }}
      >
        <p className="font-mono text-[11px] tracking-[0.14em] uppercase text-muted-foreground/50">
          Playground
        </p>
      </m.div>

      <div className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50%-100px)] pb-4 scrollbar-hide">
        {projects.map((project, index) => {
          const tilt = cardTilt(index)
          return (
            <m.div
              key={project.slug}
              className="w-[200px] shrink-0 snap-center"
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
        zIndex,
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
        className="will-change-transform transition-[transform,filter] duration-700 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          rotate: tilt,
          scale: isHovered ? 1.06 : 1,
          filter: hasHoverTarget && !isHovered
            ? 'brightness(0.82) saturate(0.68)'
            : cardBrightness,
        }}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <ProjectCard
          slug={project.slug}
          frontmatter={project.frontmatter}
          index={index}
          hideLiveBadge
          hideLabel
        />
        <AnimatePresence>
          {isHovered && (
            <m.div
              className="mt-1 text-center"
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2, ease: ENTRANCE.ease }}
            >
              <p className="font-mono text-[9px] tracking-[0.06em] text-muted-foreground/50 truncate">
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
      {/* Mobile: horizontal snap carousel */}
      <MobilePlayground projects={projects} />

      {/* Desktop: rotating orbit */}
      <div className="hidden md:block h-full relative">
        {/* Center label — absolutely centered independent of orbit */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <CenterLabel />
        </div>

        {/* Orbit cards — each positioned independently via useTransform */}
        {mounted ? projects.map((project, index) => {
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
        }) : null}
      </div>
    </div>
  )
}
