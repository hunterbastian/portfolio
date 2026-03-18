'use client'

import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, m, useMotionValue, useTransform, useAnimationFrame, useReducedMotion } from 'framer-motion'
import type { Project } from '@/types/project'
import ProjectCard from '@/components/ProjectCard'

interface PlaygroundOrbitProps {
  projects: Project[]
}

const NORMAL_SPEED = 0.04
const SLOW_SPEED = 0.01
const ORBIT_RADIUS = 320

/* ─────────────────────────────────────────────────────────
 * ENTRANCE STORYBOARD
 *
 *    0ms   waiting for mount
 *  200ms   center label fades in
 *  400ms   cards begin staggered reveal (80ms each)
 * ───────────────────────────────────────────────────────── */

const ENTRANCE = {
  centerDelay: 0.3,
  cardsDelay: 0.6,
  cardStagger: 0.12,
  cardDuration: 0.7,
  ease: [0.16, 1, 0.3, 1] as const,
}

/** Tilts alternate between -4°, 0°, 4° for a scattered feel */
function cardTilt(index: number) {
  return ((index % 3) - 1) * 4
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

function CenterLabel({ count }: { count: number }) {
  return (
    <m.div
      className="text-center flex flex-col items-center"
      initial={{ opacity: 0, scale: 0.96, filter: 'blur(4px)' }}
      animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
      transition={{ duration: 0.4, delay: ENTRANCE.centerDelay, ease: ENTRANCE.ease }}
    >
      <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground/60">
        Playground
      </p>
      <p className="mt-2 max-w-[180px] font-mono text-[10px] leading-relaxed tracking-[0.04em] text-muted-foreground/40">
        a collection of my random projects :)
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
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: ENTRANCE.ease }}
      >
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground/60">
          Playground
        </p>
        <p className="mt-2 max-w-[200px] mx-auto font-mono text-[10px] leading-relaxed tracking-[0.04em] text-muted-foreground/40">
          a collection of my random projects :)
        </p>
      </m.div>

      <div className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50%-100px)] pb-4 scrollbar-hide">
        {projects.map((project, index) => {
          const tilt = cardTilt(index)
          return (
            <m.div
              key={project.slug}
              className="w-[180px] shrink-0 snap-center"
              style={{ transform: `rotate(${tilt}deg)` }}
              initial={prefersReducedMotion ? false : { opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
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
              {project.frontmatter.demo && (
                <LiveDemoPill title={project.frontmatter.title} href={project.frontmatter.demo} />
              )}
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
  mounted,
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
  mounted: boolean
  prefersReducedMotion: boolean
  onHoverStart: () => void
  onHoverEnd: () => void
}) {
  const x = useTransform(rotation, (r) => {
    const rad = ((baseAngle + r) * Math.PI) / 180
    return Math.sin(rad) * ORBIT_RADIUS
  })
  const y = useTransform(rotation, (r) => {
    const rad = ((baseAngle + r) * Math.PI) / 180
    return -Math.cos(rad) * ORBIT_RADIUS
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
        marginTop: -54,
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
        className="transition-[transform,filter] duration-300 ease-out"
        style={{
          transform: `rotate(${tilt}deg) scale(${isHovered ? 1.1 : 1})`,
          filter: hasHoverTarget && !isHovered ? 'brightness(0.92) saturate(0.8)' : 'none',
        }}
        onMouseEnter={onHoverStart}
        onMouseLeave={onHoverEnd}
      >
        <ProjectCard
          slug={project.slug}
          frontmatter={project.frontmatter}
          index={index}
          hideLiveBadge
        />
        <AnimatePresence>
          {project.frontmatter.demo && isHovered && (
            <m.div
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
            >
              <LiveDemoPill title={project.frontmatter.title} href={project.frontmatter.demo} />
            </m.div>
          )}
        </AnimatePresence>
      </div>
    </m.div>
  )
}

export default function PlaygroundOrbit({ projects }: PlaygroundOrbitProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const [orbitActive, setOrbitActive] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const count = projects.length
  const rotation = useMotionValue(0)
  const speedRef = useRef(0)

  useEffect(() => {
    setMounted(true)
    // Start orbit after all cards have finished their entrance
    const entranceDuration = (ENTRANCE.cardsDelay + count * ENTRANCE.cardStagger + ENTRANCE.cardDuration) * 1000
    const timer = setTimeout(() => setOrbitActive(true), entranceDuration)
    return () => clearTimeout(timer)
  }, [count])

  useAnimationFrame(() => {
    const target = !orbitActive ? 0 : hoveredIndex !== null ? SLOW_SPEED : NORMAL_SPEED
    speedRef.current += (target - speedRef.current) * 0.03
    if (Math.abs(speedRef.current) > 0.0001) {
      rotation.set((rotation.get() + speedRef.current) % 360)
    }
  })

  return (
    <div className="h-full">
      {/* Mobile: horizontal snap carousel */}
      <MobilePlayground projects={projects} />

      {/* Desktop: rotating orbit */}
      <div className="hidden md:block h-full relative">
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-10">
          <CenterLabel count={count} />
        </div>

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
              mounted={mounted}
              prefersReducedMotion={prefersReducedMotion}
              onHoverStart={() => setHoveredIndex(index)}
              onHoverEnd={() => setHoveredIndex(null)}
            />
          )
        })}
      </div>
    </div>
  )
}
