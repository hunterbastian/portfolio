export interface BlogFrontmatter {
  title: string
  description: string
  date: string
  tags?: string[]
}

export interface BlogPost {
  slug: string
  frontmatter: BlogFrontmatter
  content: string
}
