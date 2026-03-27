'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { AnimatePresence, m, useMotionValue, useTransform, useAnimationFrame, useReducedMotion } from 'framer-motion'
import type { Project } from '@/types/project'
import { MOTION_EASE_SOFT } from '@/lib/motion'
import ProjectCard from '@/components/ProjectCard'

interface PlaygroundOrbitProps {
  projects: Project[]
}

const NORMAL_SPEED = 0.03
const SLOW_SPEED = 0.008
const ORBIT_RADIUS_DESKTOP = 300
const ORBIT_RADIUS_LARGE = 360

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
function useOrbitRadius() {
  const [radius, setRadius] = useState(ORBIT_RADIUS_DESKTOP)

  useEffect(() => {
    function update() {
      setRadius(window.innerWidth >= 1280 ? ORBIT_RADIUS_LARGE : ORBIT_RADIUS_DESKTOP)
    }
    update()
    window.addEventListener('resize', update)
    return () => window.removeEventListener('resize', update)
  }, [])

  return radius
}

function LiveDemoPill({ title, href }: { title: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="mt-1.5 flex items-center justify-center gap-1.5 rounded-full border border-emerald-400/20 bg-emerald-400/[0.08] px-3 py-1 text-[10px] font-medium tracking-[0.04em] backdrop-blur-md shadow-[0_0_8px_rgba(52,211,153,0.1)] transition-all duration-200 hover:bg-emerald-400/[0.14] hover:shadow-[0_0_12px_rgba(52,211,153,0.18)] hover:-translate-y-0.5"
      aria-label={`Live demo for ${title}`}
    >
      <span className="relative flex h-2 w-2">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-50" />
        <span className="absolute inset-[-2px] rounded-full bg-emerald-400/20" />
        <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_4px_rgba(52,211,153,0.5)]" />
      </span>
      <span className="font-mono lowercase text-foreground">live demo</span>
    </a>
  )
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

  return (
    <m.div
      className="absolute w-[144px]"
      style={{
        left: '50%',
        top: '50%',
        x,
        y,
        marginLeft: -72,
        marginTop: -72,
      }}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8, filter: 'blur(6px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{
        duration: ENTRANCE.cardDuration,
        delay: ENTRANCE.cardsDelay + index * ENTRANCE.cardStagger,
        ease: ENTRANCE.ease,
      }}
    >
      <div
        className="transition-[transform,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]"
        style={{
          transform: `rotate(${tilt}deg) scale(${isHovered ? 1.06 : 1})`,
          filter: hasHoverTarget && !isHovered ? 'brightness(0.88) saturate(0.75)' : 'none',
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
      </div>
    </m.div>
  )
}

export default function PlaygroundOrbit({ projects }: PlaygroundOrbitProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [orbitActive, setOrbitActive] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const count = projects.length
  const rotation = useMotionValue(0)
  const speedRef = useRef(0)
  const orbitRadius = useOrbitRadius()

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
        {projects.map((project, index) => {
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
              prefersReducedMotion={prefersReducedMotion}
              onHoverStart={() => handleHoverStart(index)}
              onHoverEnd={handleHoverEnd}
            />
          )
        })}
      </div>
    </div>
  )
}
