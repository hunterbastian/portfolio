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
  centerDelay: 0.2,
  cardsDelay: 0.4,
  cardStagger: 0.08,
  cardDuration: 0.5,
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
      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none text-center"
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: ENTRANCE.centerDelay, ease: ENTRANCE.ease }}
    >
      <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground/60">
        Playground
      </p>
      <p className="mt-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground/40 tabular-nums">
        {count} projects
      </p>
    </m.div>
  )
}

function MobilePlayground({ projects }: PlaygroundOrbitProps) {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <div className="flex h-full flex-col items-center justify-center lg:hidden">
      <m.div
        className="mb-8 text-center"
        initial={prefersReducedMotion ? false : { opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1, ease: ENTRANCE.ease }}
      >
        <p className="font-mono text-[11px] tracking-[0.12em] uppercase text-muted-foreground/60">
          Playground
        </p>
        <p className="mt-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground/40 tabular-nums">
          {projects.length} projects
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

export default function PlaygroundOrbit({ projects }: PlaygroundOrbitProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [mounted, setMounted] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const count = projects.length
  const rotation = useMotionValue(0)
  const counterRotation = useTransform(rotation, (v) => -v)
  const speedRef = useRef(NORMAL_SPEED)

  useEffect(() => {
    setMounted(true)
  }, [])

  useAnimationFrame(() => {
    const target = hoveredIndex !== null ? SLOW_SPEED : NORMAL_SPEED
    speedRef.current += (target - speedRef.current) * 0.05
    rotation.set((rotation.get() + speedRef.current) % 360)
  })

  return (
    <div className="h-full">
      {/* Mobile: horizontal snap carousel */}
      <MobilePlayground projects={projects} />

      {/* Desktop: rotating orbit */}
      <div className="hidden lg:flex items-center justify-center h-full relative">
        <CenterLabel count={count} />

        <m.div
          className="relative"
          style={{
            width: ORBIT_RADIUS * 2 + 300,
            height: ORBIT_RADIUS * 2 + 300,
            rotate: rotation,
          }}
        >
          {projects.map((project, index) => {
            const angle = (index / count) * 360
            const tilt = cardTilt(index)
            const isHovered = hoveredIndex === index

            return (
              <m.div
                key={project.slug}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateY(-${ORBIT_RADIUS}px) rotate(-${angle}deg)`,
                  marginLeft: -72,
                  marginTop: -54,
                }}
                initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.8 }}
                animate={mounted ? { opacity: 1, scale: 1 } : false}
                transition={{
                  duration: ENTRANCE.cardDuration,
                  delay: ENTRANCE.cardsDelay + index * ENTRANCE.cardStagger,
                  ease: ENTRANCE.ease,
                }}
              >
                <m.div
                  className="w-[144px]"
                  style={{ rotate: counterRotation }}
                >
                  <div
                    className="transition-[transform,filter] duration-300 ease-out"
                    style={{
                      transform: `rotate(${tilt}deg) scale(${isHovered ? 1.1 : 1})`,
                      filter: hoveredIndex !== null && !isHovered ? 'brightness(0.92) saturate(0.8)' : 'none',
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <ProjectCard
                      slug={project.slug}
                      frontmatter={project.frontmatter}
                      index={index}
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
              </m.div>
            )
          })}
        </m.div>
      </div>
    </div>
  )
}
