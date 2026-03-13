import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import type { BlogPost, BlogFrontmatter } from '@/types/blog'

const blogDirectory = path.join(process.cwd(), 'content/blog')

function parseBlogFile(fileName: string): BlogPost {
  const fullPath = path.join(blogDirectory, fileName)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  return {
    slug: fileName.replace(/\.mdx$/, ''),
    frontmatter: data as BlogFrontmatter,
    content,
  }
}

function sortByDateDescending(a: BlogPost, b: BlogPost): number {
  return new Date(b.frontmatter.date).getTime() - new Date(a.frontmatter.date).getTime()
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) {
    return []
  }

  return fs
    .readdirSync(blogDirectory)
    .filter((name) => name.endsWith('.mdx'))
    .map(parseBlogFile)
    .sort(sortByDateDescending)
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!slug || !/^[a-z0-9-]+$/.test(slug)) {
    return null
  }

  const fullPath = path.join(blogDirectory, `${slug}.mdx`)
  if (!fs.existsSync(fullPath)) {
    return null
  }

  return parseBlogFile(`${slug}.mdx`)
}
