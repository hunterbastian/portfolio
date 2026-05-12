import type { Project } from '@/types/project'

export interface ProjectEndNavItem {
  slug: string
  title: string
  description: string
  category: string
  image: string
}

export interface ProjectEndNavigation {
  nextProject: ProjectEndNavItem | null
  relatedProject: ProjectEndNavItem | null
}

export function toProjectEndNavItem(project: Project): ProjectEndNavItem {
  return {
    slug: project.slug,
    title: project.frontmatter.displayTitle ?? project.frontmatter.title,
    description: project.frontmatter.description,
    category: project.frontmatter.category,
    image: project.frontmatter.image,
  }
}

export function getNextProject(projects: Project[], currentSlug: string): Project | null {
  if (projects.length <= 1) return null

  const currentIndex = projects.findIndex((project) => project.slug === currentSlug)
  if (currentIndex < 0) return projects[0] ?? null

  return projects[(currentIndex + 1) % projects.length] ?? null
}

export function getRelatedProject(
  projects: Project[],
  currentProject: Project,
  nextProject: Project | null,
): Project | null {
  const currentTags = new Set(currentProject.frontmatter.tags.map((tag) => tag.toLowerCase()))
  const candidates = projects.filter((project) => project.slug !== currentProject.slug && project.slug !== nextProject?.slug)

  return (
    candidates.find((project) => project.frontmatter.category === currentProject.frontmatter.category) ??
    candidates.find((project) => project.frontmatter.tags.some((tag) => currentTags.has(tag.toLowerCase()))) ??
    candidates[0] ??
    null
  )
}

export function getProjectEndNavigation(projects: Project[], currentProject: Project): ProjectEndNavigation {
  const nextProject = getNextProject(projects, currentProject.slug)
  const relatedProject = getRelatedProject(projects, currentProject, nextProject)

  return {
    nextProject: nextProject ? toProjectEndNavItem(nextProject) : null,
    relatedProject: relatedProject ? toProjectEndNavItem(relatedProject) : null,
  }
}
