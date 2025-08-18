export interface ProjectFrontmatter {
  title: string
  description: string
  category: string
  tags: string[]
  image: string
  github?: string
  demo?: string
  featured?: boolean
  date: string
}

export interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
  content: string
}
