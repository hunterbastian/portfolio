import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { Project, ProjectFrontmatter } from '@/types/project'

const projectsDirectory = path.join(process.cwd(), 'content/projects')

export function getAllProjects(): Project[] {
  if (!fs.existsSync(projectsDirectory)) {
    return []
  }

  const fileNames = fs.readdirSync(projectsDirectory)
  const projects = fileNames
    .filter((name) => name.endsWith('.mdx'))
    .map((name) => {
      const fullPath = path.join(projectsDirectory, name)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data, content } = matter(fileContents)

      return {
        slug: name.replace(/\.mdx$/, ''),
        frontmatter: data as ProjectFrontmatter,
        content,
      }
    })
    .sort((a, b) => new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime())

  return projects
}

export function getProjectBySlug(slug: string): Project | null {
  try {
    // Sanitize slug to prevent path traversal attacks
    const sanitizedSlug = slug.replace(/[^a-zA-Z0-9\-_]/g, '')
    
    // Additional validation to prevent directory traversal
    if (sanitizedSlug !== slug || slug.includes('..') || slug.includes('/') || slug.includes('\\')) {
      console.error(`Invalid slug attempted: ${slug}`)
      return null
    }
    
    const fullPath = path.join(projectsDirectory, `${sanitizedSlug}.mdx`)
    
    // Ensure the resolved path is within the projects directory
    const resolvedPath = path.resolve(fullPath)
    const resolvedProjectsDir = path.resolve(projectsDirectory)
    
    if (!resolvedPath.startsWith(resolvedProjectsDir)) {
      console.error(`Path traversal attempt detected: ${slug}`)
      return null
    }
    
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug: sanitizedSlug,
      frontmatter: data as ProjectFrontmatter,
      content,
    }
  } catch (error) {
    // Log the error for debugging purposes
    console.error(`Error loading project ${slug}:`, error)
    
    // In production, you might want to send this to an error tracking service
    if (process.env.NODE_ENV === 'development') {
      console.error('Full error details:', {
        slug,
        path: path.join(projectsDirectory, `${slug}.mdx`),
        error: error instanceof Error ? error.message : 'Unknown error'
      })
    }
    
    return null
  }
}

export function getAllCategories(): string[] {
  const projects = getAllProjects()
  const categories = projects.map((project) => project.frontmatter.category)
  return [...new Set(categories)]
}
