export interface ProjectFrontmatter {
  title: string
  displayTitle?: string
  description: string
  category: string
  tags: string[]
  image: string
  video?: string
  github?: string
  demo?: string
  featured?: boolean
  archived?: boolean
  date: string
}

export interface Project {
  slug: string
  frontmatter: ProjectFrontmatter
  content: string
}
