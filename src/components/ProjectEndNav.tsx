'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { analytics } from '@/lib/analytics'
import { showJoyToast } from '@/lib/joy'
import {
  PROJECT_END_NAV_ARIA_LABEL,
  PROJECT_END_NAV_DESCRIPTION_CLASS_NAME,
  PROJECT_END_NAV_EYEBROW,
  PROJECT_END_NAV_EYEBROW_CLASS_NAME,
  PROJECT_END_NAV_GRID_CLASS_NAME,
  PROJECT_END_NAV_HEADER_CLASS_NAME,
  PROJECT_END_NAV_HEADING,
  PROJECT_END_NAV_HEADING_CLASS_NAME,
  PROJECT_END_NAV_ICON_CLASS_NAME,
  PROJECT_END_NAV_IMAGE_CLASS_NAME,
  PROJECT_END_NAV_IMAGE_FRAME_CLASS_NAME,
  PROJECT_END_NAV_IMAGE_SIZES,
  PROJECT_END_NAV_LABEL_CLASS_NAME,
  PROJECT_END_NAV_LINK_BODY_CLASS_NAME,
  PROJECT_END_NAV_LINK_CLASS_NAME,
  PROJECT_END_NAV_LINK_LAYOUT_CLASS_NAME,
  PROJECT_END_NAV_LINK_META_CLASS_NAME,
  PROJECT_END_NAV_SECTION_CLASS_NAME,
  PROJECT_END_NAV_TITLE_CLASS_NAME,
  activateProjectEndNavLink,
  getProjectEndNavEntries,
  getProjectEndNavHref,
  type ProjectEndNavItem,
  type ProjectEndNavSource,
} from '@/lib/project-navigation'

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
  source: ProjectEndNavSource
}) {
  const haptic = useWebHaptics()

  return (
    <Link
      href={getProjectEndNavHref(item)}
      className={PROJECT_END_NAV_LINK_CLASS_NAME}
      onClick={() =>
        activateProjectEndNavLink({
          currentSlug,
          currentTitle,
          item,
          showToast: showJoyToast,
          source,
          trackProjectClick: (slug, title, context) => analytics.projectClick(slug, title, context),
          triggerHaptic: (style) => haptic.trigger(style),
        })
      }
    >
      <div className={PROJECT_END_NAV_LINK_LAYOUT_CLASS_NAME}>
        <div className={PROJECT_END_NAV_IMAGE_FRAME_CLASS_NAME}>
          <Image
            src={item.image}
            alt=""
            fill
            className={PROJECT_END_NAV_IMAGE_CLASS_NAME}
            sizes={PROJECT_END_NAV_IMAGE_SIZES}
          />
        </div>
        <div className={PROJECT_END_NAV_LINK_BODY_CLASS_NAME}>
          <div className={PROJECT_END_NAV_LINK_META_CLASS_NAME}>
            <p className={PROJECT_END_NAV_LABEL_CLASS_NAME}>
              {label}
            </p>
            <ArrowRight
              aria-hidden="true"
              className={PROJECT_END_NAV_ICON_CLASS_NAME}
              strokeWidth={1.8}
            />
          </div>
          <h3 className={PROJECT_END_NAV_TITLE_CLASS_NAME}>
            {item.title}
          </h3>
          <p className={PROJECT_END_NAV_DESCRIPTION_CLASS_NAME}>
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
  const entries = getProjectEndNavEntries({ nextProject, relatedProject })

  if (!entries.length) return null

  return (
    <nav
      aria-label={PROJECT_END_NAV_ARIA_LABEL}
      className={PROJECT_END_NAV_SECTION_CLASS_NAME}
    >
      <div className={PROJECT_END_NAV_HEADER_CLASS_NAME}>
        <p className={PROJECT_END_NAV_EYEBROW_CLASS_NAME}>
          {PROJECT_END_NAV_EYEBROW}
        </p>
        <h2 className={PROJECT_END_NAV_HEADING_CLASS_NAME}>
          {PROJECT_END_NAV_HEADING}
        </h2>
      </div>

      <div className={PROJECT_END_NAV_GRID_CLASS_NAME}>
        {entries.map(({ item, label, source }) => (
          <ProjectEndNavLink
            key={source}
            item={item}
            label={label}
            currentSlug={currentSlug}
            currentTitle={currentTitle}
            source={source}
          />
        ))}
      </div>
    </nav>
  )
}
