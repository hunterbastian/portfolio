'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'
import type { ProjectEndNavItem } from '@/lib/project-navigation'

interface ProjectEndNavProps {
  currentSlug: string
  currentTitle: string
  nextProject: ProjectEndNavItem | null
  relatedProject: ProjectEndNavItem | null
}

function ProjectEndNavLink({
  item,
  label,
  currentSlug,
  currentTitle,
  source,
}: {
  item: ProjectEndNavItem
  label: string
  currentSlug: string
  currentTitle: string
  source: 'project_end_next' | 'project_end_related'
}) {
  const haptic = useWebHaptics()

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="group block touch-manipulation border border-border/70 bg-background/55 p-2.5 shadow-card-subtle transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-[1px] hover:border-foreground/18 hover:shadow-card active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
      onClick={() => {
        haptic.trigger('light')
        analytics.projectClick(item.slug, item.title, {
          source,
          projectSlug: currentSlug,
          projectTitle: currentTitle,
        })
        showJoyToast(`Opening ${item.title}`)
      }}
    >
      <div className="grid grid-cols-[4.25rem_1fr] gap-3 sm:grid-cols-[5rem_1fr]">
        <div className="relative aspect-[4/3] overflow-hidden border border-border/60 bg-card">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover transition-transform duration-300 ease-soft group-hover:scale-[1.02]"
            sizes="(max-width: 640px) 68px, 80px"
          />
        </div>
        <div className="min-w-0 space-y-1">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="font-mono text-[0.64rem] uppercase tracking-[0.12em] text-muted-foreground/65">
              {label}
            </p>
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-foreground"
              strokeWidth={1.8}
            />
          </div>
          <h3 className="truncate font-mono text-[0.88rem] font-medium leading-snug text-foreground sm:text-[0.94rem]">
            {item.title}
          </h3>
          <p className="line-clamp-2 font-inter text-[12px] leading-relaxed text-muted-foreground">
            {item.description}
          </p>
        </div>
      </div>
    </Link>
  )
}

export default function ProjectEndNav({
  currentSlug,
  currentTitle,
  nextProject,
  relatedProject,
}: ProjectEndNavProps) {
  if (!nextProject && !relatedProject) return null

  return (
    <nav
      aria-label="Continue exploring projects"
      className="not-prose mt-10 border-t border-border/70 pt-6 sm:mt-12 sm:pt-7"
    >
      <div className="mb-4 space-y-1.5">
        <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted-foreground/62">
          Keep exploring
        </p>
        <h2 className="font-mono text-[0.98rem] font-medium leading-snug text-foreground sm:text-[1.05rem]">
          More project work
        </h2>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {nextProject ? (
          <ProjectEndNavLink
            item={nextProject}
            label="Next project"
            currentSlug={currentSlug}
            currentTitle={currentTitle}
            source="project_end_next"
          />
        ) : null}
        {relatedProject ? (
          <ProjectEndNavLink
            item={relatedProject}
            label="Related project"
            currentSlug={currentSlug}
            currentTitle={currentTitle}
            source="project_end_related"
          />
        ) : null}
      </div>
    </nav>
  )
}
