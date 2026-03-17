'use client'

import { useRef, useState } from 'react'
import { m, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion'
import type { Project } from '@/types/project'
import ProjectCard from '@/components/ProjectCard'

interface PlaygroundOrbitProps {
  projects: Project[]
}

const NORMAL_SPEED = 0.04
const SLOW_SPEED = 0.01

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
      <span className="font-mono lowercase text-black">live demo</span>
    </a>
  )
}

function MobilePlayground({ projects }: PlaygroundOrbitProps) {
  return (
    <div className="flex h-full flex-col items-center justify-center lg:hidden">
      <p
        className="mb-6 text-center text-xs tracking-[0.06em] text-muted-foreground"
        style={{ fontFamily: 'inherit' }}
      >
        a place for my random projects 😊
      </p>

      <div className="flex w-full snap-x snap-mandatory gap-5 overflow-x-auto px-[calc(50%-100px)] pb-4 scrollbar-hide">
        {projects.map((project, index) => {
          const tilt = cardTilt(index)
          return (
            <div
              key={project.slug}
              className="w-[200px] shrink-0 snap-center"
              style={{ transform: `rotate(${tilt}deg)` }}
            >
              <ProjectCard
                slug={project.slug}
                frontmatter={project.frontmatter}
                index={index}
              />
              {project.frontmatter.demo && (
                <LiveDemoPill title={project.frontmatter.title} href={project.frontmatter.demo} />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default function PlaygroundOrbit({ projects }: PlaygroundOrbitProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const count = projects.length
  const radius = 340
  const rotation = useMotionValue(0)
  const counterRotation = useTransform(rotation, (v) => -v)
  const speedRef = useRef(NORMAL_SPEED)

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
        <p
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none text-xs tracking-[0.06em] text-muted-foreground whitespace-nowrap z-10"
          style={{ fontFamily: 'inherit' }}
        >
          a place for my random projects 😊
        </p>

        <m.div
          className="relative"
          style={{
            width: radius * 2 + 300,
            height: radius * 2 + 300,
            rotate: rotation,
          }}
        >
          {projects.map((project, index) => {
            const angle = (index / count) * 360
            const tilt = cardTilt(index)
            const isHovered = hoveredIndex === index

            return (
              <div
                key={project.slug}
                className="absolute left-1/2 top-1/2"
                style={{
                  transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                  marginLeft: -80,
                  marginTop: -60,
                }}
              >
                <m.div
                  className="w-[160px]"
                  style={{ rotate: counterRotation }}
                >
                  <div
                    className="transition-transform duration-300 ease-out"
                    style={{
                      transform: `rotate(${tilt}deg) scale(${isHovered ? 1.12 : 1})`,
                    }}
                    onMouseEnter={() => setHoveredIndex(index)}
                    onMouseLeave={() => setHoveredIndex(null)}
                  >
                    <ProjectCard
                      slug={project.slug}
                      frontmatter={project.frontmatter}
                      index={index}
                    />
                    {project.frontmatter.demo && (
                      <LiveDemoPill title={project.frontmatter.title} href={project.frontmatter.demo} />
                    )}
                  </div>
                </m.div>
              </div>
            )
          })}
        </m.div>
      </div>
    </div>
  )
}
