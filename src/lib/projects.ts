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
    const fullPath = path.join(projectsDirectory, `${slug}.mdx`)
    const fileContents = fs.readFileSync(fullPath, 'utf8')
    const { data, content } = matter(fileContents)

    return {
      slug,
      frontmatter: data as ProjectFrontmatter,
      content,
    }
  } catch {
    return null
  }
}

export function getAllCategories(): string[] {
  const projects = getAllProjects()
  const categories = projects.map((project) => project.frontmatter.category)
  return [...new Set(categories)]
}
