import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Project, ProjectFrontmatter } from '@/types/project'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

const PROJECT_SLUG_PATTERN = /^[a-z0-9-]+$/

interface ProjectIndex {
  all: Project[]
  published: Project[]
  archived: Project[]
  bySlug: Map<string, Project>
  categories: string[]
}

let cachedProjectIndex: ProjectIndex | null = null

export function isValidProjectSlug(slug: string): boolean {
  if (!slug) {
    return false
  }

  return PROJECT_SLUG_PATTERN.test(slug)
}

function parseProjectFile(fileName: string): Project {
  const fullPath = path.join(projectsDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: fileName.replace(/\.mdx$/, ''),
    frontmatter: data as ProjectFrontmatter,
    content,
  }
}

function sortByDateDescending(a: Project, b: Project): number {
  return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
}

function loadAllProjectFiles(): Project[] {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  return fs
    .readdirSync(projectsDirectory)
    .filter((name) => name.endsWith('.mdx'))
    .map(parseProjectFile)
}

function buildProjectIndex(): ProjectIndex {
  const allProjects = loadAllProjectFiles().sort(sortByDateDescending)
  const publishedProjects = allProjects.filter((project) => !project.frontmatter.archived)
  const archivedProjects = allProjects.filter((project) => project.frontmatter.archived === true)

  return {
    all: allProjects,
    published: publishedProjects,
    archived: archivedProjects,
    bySlug: new Map(allProjects.map((project) => [project.slug, project])),
    categories: [...new Set(publishedProjects.map((project) => project.frontmatter.category))],
  }
}

function getProjectIndex(): ProjectIndex {
  if (!cachedProjectIndex) {
    cachedProjectIndex = buildProjectIndex()
  }

  return cachedProjectIndex
}

export function getAllProjects(): Project[] {
  return getProjectIndex().published
}

export function getArchivedProjects(): Project[] {
  return getProjectIndex().archived
}

export function getProjectBySlug(slug: string): Project | null {
  if (!isValidProjectSlug(slug)) {
    return null
  }

  try {
    return getProjectIndex().bySlug.get(slug) ?? null
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error)
    return null
  }
}

export function getAllCategories(): string[] {
  return getProjectIndex().categories
}
