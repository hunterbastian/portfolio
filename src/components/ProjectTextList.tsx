'use client'

import { useCallback, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { MOTION_EASE_SOFT, MOTION_SPRING_SNAPPY } from '@/lib/motion'
import { ProjectFrontmatter } from '@/types/project'

interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
}

interface ProjectTextListProps {
  projects: Project[]
}

const CASE_STUDY_ORDER = [
  'lumo',
  'ai-project',
  'wander-utah',
  'brand-identity-system',
  'porsche-app',
  'aol-redesign',
  'grand-teton-wallet',
  'nutricost',
] as const

export default function ProjectTextList({ projects }: ProjectTextListProps) {
  const router = useRouter()
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, { stiffness: 300, damping: 30 })
  const springY = useSpring(mouseY, { stiffness: 300, damping: 30 })

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    mouseX.set(e.clientX + 24)
    mouseY.set(e.clientY - 80)
  }, [mouseX, mouseY])

  const orderedProjects = [...projects].sort((a, b) => {
    const aIdx = CASE_STUDY_ORDER.indexOf(a.slug as typeof CASE_STUDY_ORDER[number])
    const bIdx = CASE_STUDY_ORDER.indexOf(b.slug as typeof CASE_STUDY_ORDER[number])
    if (aIdx === -1 && bIdx === -1) return 0
    if (aIdx === -1) return 1
    if (bIdx === -1) return -1
    return aIdx - bIdx
  })

  const hoveredProject = hoveredSlug
    ? orderedProjects.find(p => p.slug === hoveredSlug)
    : null

  return (
    <div
      ref={containerRef}
      className="relative"
      onMouseMove={handleMouseMove}
    >
      <div className="border-t border-border">
        {orderedProjects.map((project, index) => {
          const isHovered = hoveredSlug === project.slug
          const hasHover = hoveredSlug !== null
          const title = project.frontmatter.displayTitle || project.frontmatter.title

          return (
            <m.button
              key={project.slug}
              type="button"
              onClick={() => router.push(`/projects/${project.slug}`)}
              onMouseEnter={() => setHoveredSlug(project.slug)}
              onMouseLeave={() => setHoveredSlug(null)}
              className="group relative flex w-full items-center justify-between border-b border-border px-1 py-4 text-left transition-[color,opacity,filter] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary sm:py-5"
              style={{
                opacity: hasHover && !isHovered ? 0.35 : 1,
                filter: hasHover && !isHovered ? 'blur(1px)' : 'none',
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: index * 0.06,
                ease: MOTION_EASE_SOFT,
              }}
            >
              <div className="flex items-center gap-3">
                {isHovered && (
                  <m.span
                    className="w-[4px] h-[4px] rounded-full bg-accent shrink-0"
                    layoutId="project-dot"
                    transition={MOTION_SPRING_SNAPPY}
                    aria-hidden
                  />
                )}
                <span className={`font-mono text-[13px] tracking-[0.04em] transition-colors duration-300 sm:text-[14px] ${
                  isHovered ? 'text-foreground' : 'text-foreground/70'
                }`}>
                  {title}
                </span>
              </div>
              <span className="font-mono text-[9px] tracking-[0.1em] text-muted-foreground/50 uppercase shrink-0">
                {project.frontmatter.category}
              </span>
            </m.button>
          )
        })}
      </div>

      <AnimatePresence>
        {hoveredProject?.frontmatter.image && (
          <m.div
            className="pointer-events-none fixed z-50 overflow-hidden shadow-lg"
            style={{
              x: springX,
              y: springY,
              width: 280,
            }}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{
              opacity: { duration: 0.25, ease: MOTION_EASE_SOFT },
              scale: { duration: 0.35, ease: MOTION_EASE_SOFT },
            }}
          >
            <Image
              src={hoveredProject.frontmatter.image}
              alt={hoveredProject.frontmatter.title}
              width={560}
              height={315}
              className="h-auto w-full object-cover"
              sizes="280px"
              priority={false}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
