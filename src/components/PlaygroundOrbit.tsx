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

export default function PlaygroundOrbit({ projects }: PlaygroundOrbitProps) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const count = projects.length
  const radius = 200
  const rotation = useMotionValue(0)
  const counterRotation = useTransform(rotation, (v) => -v)
  const speedRef = useRef(NORMAL_SPEED)

  useAnimationFrame(() => {
    const target = hoveredIndex !== null ? SLOW_SPEED : NORMAL_SPEED
    // Ease toward target speed
    speedRef.current += (target - speedRef.current) * 0.05
    rotation.set((rotation.get() + speedRef.current) % 360)
  })

  return (
    <div className="hidden lg:flex items-center justify-center h-[calc(100vh-140px)] relative">
      {/* Center text — outside the rotating container so it never moves */}
      <p
        className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none text-xs tracking-[0.06em] text-muted-foreground whitespace-nowrap z-10"
        style={{ fontFamily: 'inherit' }}
      >
        a place for my random stuff :)
      </p>

      <m.div
        className="relative"
        style={{
          width: radius * 2 + 253,
          height: radius * 2 + 253,
          rotate: rotation,
        }}
      >
        {projects.map((project, index) => {
          const angle = (index / count) * 360
          const tilt = ((index % 3) - 1) * 4
          const isHovered = hoveredIndex === index

          return (
            <div
              key={project.slug}
              className="absolute left-1/2 top-1/2"
              style={{
                transform: `rotate(${angle}deg) translateY(-${radius}px) rotate(-${angle}deg)`,
                marginLeft: -65,
                marginTop: -54,
              }}
            >
              <m.div
                className="w-[130px]"
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
                </div>
              </m.div>
            </div>
          )
        })}
      </m.div>
    </div>
  )
}
