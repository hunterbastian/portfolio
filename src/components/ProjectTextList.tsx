'use client'

import type { MouseEvent } from 'react'
import { useCallback, useMemo, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AnimatePresence, m, useMotionValue, useSpring } from 'framer-motion'
import Image from 'next/image'
import { MOTION_SPRING_SNAPPY } from '@/lib/motion'
import { analytics } from '@/lib/analytics'
import {
  CASE_STUDY_TEXT_LIST_ITEM_ANIMATE,
  CASE_STUDY_TEXT_LIST_ITEM_INITIAL,
  CASE_STUDY_TEXT_LIST_CATEGORY_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_CONTAINER_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_DOT_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_DOT_LAYOUT_ID,
  CASE_STUDY_TEXT_LIST_LIST_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_PREVIEW_ANIMATE,
  CASE_STUDY_TEXT_LIST_PREVIEW_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_PREVIEW_EXIT,
  CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_HEIGHT,
  CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_WIDTH,
  CASE_STUDY_TEXT_LIST_PREVIEW_INITIAL,
  CASE_STUDY_TEXT_LIST_PREVIEW_SIZES,
  CASE_STUDY_TEXT_LIST_ROW_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_ROW_CONTENT_CLASS_NAME,
  CASE_STUDY_TEXT_LIST_SPRING,
  activateCaseStudyTextListHoverEnd,
  activateCaseStudyTextListHoverStart,
  activateCaseStudyTextListRow,
  getCaseStudyTextListViewStateFromOrderedProjects,
  getCaseStudyTextListItemTransition,
  getCaseStudyTextListMousePosition,
  getCaseStudyTextListPreviewStyle,
  getCaseStudyTextListPreviewTransition,
  sortCaseStudyProjects,
  type CaseStudyProject,
} from '@/lib/case-study-projects'

interface ProjectTextListProps {
  projects: CaseStudyProject[]
}

export default function ProjectTextList({ projects }: ProjectTextListProps) {
  const router = useRouter()
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)
  const springX = useSpring(mouseX, CASE_STUDY_TEXT_LIST_SPRING)
  const springY = useSpring(mouseY, CASE_STUDY_TEXT_LIST_SPRING)

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const { x, y } = getCaseStudyTextListMousePosition(e.clientX, e.clientY)
    mouseX.set(x)
    mouseY.set(y)
  }, [mouseX, mouseY])

  const orderedProjects = useMemo(() => sortCaseStudyProjects(projects), [projects])
  const viewState = useMemo(
    () => getCaseStudyTextListViewStateFromOrderedProjects(orderedProjects, hoveredSlug),
    [hoveredSlug, orderedProjects],
  )

  return (
    <div
      ref={containerRef}
      className={CASE_STUDY_TEXT_LIST_CONTAINER_CLASS_NAME}
      onMouseMove={handleMouseMove}
    >
      <div className={CASE_STUDY_TEXT_LIST_LIST_CLASS_NAME}>
        {viewState.rows.map(({ category, href, index, isHovered, project, rowStyle, title, titleClassName }) => (
          <m.button
            key={project.slug}
            type="button"
            onClick={() =>
              activateCaseStudyTextListRow({
                href,
                navigateTo: (targetHref) => router.push(targetHref),
                project,
                title,
                trackProjectClick: (slug, projectTitle) => analytics.projectClick(slug, projectTitle),
              })
            }
            onMouseEnter={() =>
              activateCaseStudyTextListHoverStart({
                projectSlug: project.slug,
                setHoveredSlug,
              })
            }
            onMouseLeave={() =>
              activateCaseStudyTextListHoverEnd({
                setHoveredSlug,
              })
            }
            className={CASE_STUDY_TEXT_LIST_ROW_CLASS_NAME}
            style={rowStyle}
            initial={CASE_STUDY_TEXT_LIST_ITEM_INITIAL}
            animate={CASE_STUDY_TEXT_LIST_ITEM_ANIMATE}
            transition={getCaseStudyTextListItemTransition(index)}
          >
            <div className={CASE_STUDY_TEXT_LIST_ROW_CONTENT_CLASS_NAME}>
              {isHovered && (
                <m.span
                  className={CASE_STUDY_TEXT_LIST_DOT_CLASS_NAME}
                  layoutId={CASE_STUDY_TEXT_LIST_DOT_LAYOUT_ID}
                  transition={MOTION_SPRING_SNAPPY}
                  aria-hidden
                />
              )}
              <span className={titleClassName}>
                {title}
              </span>
            </div>
            <span className={CASE_STUDY_TEXT_LIST_CATEGORY_CLASS_NAME}>
              {category}
            </span>
          </m.button>
        ))}
      </div>

      <AnimatePresence>
        {viewState.preview && (
          <m.div
            className={CASE_STUDY_TEXT_LIST_PREVIEW_CLASS_NAME}
            style={getCaseStudyTextListPreviewStyle(springX, springY)}
            initial={CASE_STUDY_TEXT_LIST_PREVIEW_INITIAL}
            animate={CASE_STUDY_TEXT_LIST_PREVIEW_ANIMATE}
            exit={CASE_STUDY_TEXT_LIST_PREVIEW_EXIT}
            transition={getCaseStudyTextListPreviewTransition()}
          >
            <Image
              src={viewState.preview.image}
              alt={viewState.preview.alt}
              width={CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_WIDTH}
              height={CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_HEIGHT}
              className={CASE_STUDY_TEXT_LIST_PREVIEW_IMAGE_CLASS_NAME}
              sizes={CASE_STUDY_TEXT_LIST_PREVIEW_SIZES}
              priority={false}
            />
          </m.div>
        )}
      </AnimatePresence>
    </div>
  )
}
