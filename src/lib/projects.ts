import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { Project, ProjectFrontmatter } from '@/types/project'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

const PROJECT_SLUG_PATTERN = /^[a-z0-9-]+$/

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

export function getAllProjects(): Project[] {
  return loadAllProjectFiles()
    .filter((project) => !project.frontmatter.archived)
    .sort(sortByDateDescending)
}

export function getArchivedProjects(): Project[] {
  return loadAllProjectFiles()
    .filter((project) => project.frontmatter.archived === true)
    .sort(sortByDateDescending)
}

export function getProjectBySlug(slug: string): Project | null {
  if (!isValidProjectSlug(slug)) {
    return null
  }

  const fullPath = path.join(projectsDirectory, `${slug}.mdx`)

  if (!fs.existsSync(fullPath)) {
    return null
  }

  try {
    return parseProjectFile(`${slug}.mdx`)
  } catch (error) {
    console.error(`Error loading project ${slug}:`, error)
    return null
  }
}

export function getAllCategories(): string[] {
  const categories = getAllProjects().map((project) => project.frontmatter.category)
  return [...new Set(categories)]
}
