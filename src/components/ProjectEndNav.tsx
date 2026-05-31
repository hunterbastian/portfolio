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
  indexLabel,
  label,
  currentSlug,
  currentTitle,
  source,
}: {
  item: ProjectEndNavItem
  indexLabel: string
  label: string
  currentSlug: string
  currentTitle: string
  source: 'project_end_next' | 'project_end_related'
}) {
  const haptic = useWebHaptics()

  return (
    <Link
      href={`/projects/${item.slug}`}
      className="group block max-w-full touch-manipulation overflow-hidden border border-border/68 bg-[color-mix(in_srgb,var(--background)_86%,#fff7ed)] p-2.5 shadow-[0_12px_28px_-26px_rgba(43,39,34,0.5),inset_0_1px_0_rgba(255,255,255,0.7)] transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-[1px] hover:border-[color-mix(in_srgb,var(--contact-accent)_28%,var(--border))] hover:shadow-[0_18px_34px_-28px_rgba(43,39,34,0.58),inset_0_1px_0_rgba(255,255,255,0.82)] active:translate-y-0 active:scale-[0.98] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
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
      <div className="grid max-w-full grid-cols-[3rem_minmax(0,1fr)] gap-3 sm:grid-cols-[3.6rem_minmax(0,1fr)] sm:gap-3.5">
        <div className="relative h-[4.4rem] overflow-hidden border border-border/60 bg-card shadow-[inset_0_1px_0_rgba(255,255,255,0.62)] sm:h-[5.25rem]">
          <Image
            src={item.image}
            alt=""
            fill
            className="object-cover saturate-[0.82] contrast-[1.02] sepia-[0.06] transition-[filter,transform] duration-300 ease-soft group-hover:scale-[1.02] group-hover:saturate-[0.9]"
            sizes="(max-width: 640px) 48px, 58px"
          />
        </div>
        <div className="min-w-0 space-y-1.5">
          <div className="flex min-w-0 items-center justify-between gap-3">
            <p className="font-mono text-[0.58rem] uppercase leading-none tracking-[0.16em] text-muted-foreground/56">
              <span className="mr-2 text-muted-foreground/38">{indexLabel}</span>
              {label}
            </p>
            <ArrowRight
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-muted-foreground/68 transition-[color,transform] duration-200 group-hover:translate-x-0.5 group-hover:text-[var(--contact-accent)]"
              strokeWidth={1.8}
            />
          </div>
          <h3 className="truncate font-mono text-[0.88rem] font-medium leading-snug text-foreground sm:text-[0.94rem]">
            {item.title}
          </h3>
          <p className="font-mono text-[0.58rem] uppercase tracking-[0.12em] text-muted-foreground/52">
            {item.category}
          </p>
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
            indexLabel="01"
            label="Next project"
            currentSlug={currentSlug}
            currentTitle={currentTitle}
            source="project_end_next"
          />
        ) : null}
        {relatedProject ? (
          <ProjectEndNavLink
            item={relatedProject}
            indexLabel="02"
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
