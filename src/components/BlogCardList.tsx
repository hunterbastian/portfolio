'use client'

import { m, useReducedMotion } from 'framer-motion'
import Link from 'next/link'
import { MOTION_EASE_SOFT } from '@/lib/motion'

interface BlogPost {
  slug: string
  frontmatter: {
    title: string
    description: string
    date: string
    tags?: string[]
  }
}

function formatDate(dateValue: string): string {
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return dateValue
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

export default function BlogCardList({ posts }: { posts: BlogPost[] }) {
  const prefersReducedMotion = useReducedMotion() ?? false

  return (
    <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
      {posts.map((post, index) => (
        <m.li
          key={post.slug}
          className="h-full"
          initial={prefersReducedMotion ? false : { opacity: 0, y: 12, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{
            duration: 0.4,
            delay: prefersReducedMotion ? 0 : 0.1 + index * 0.08,
            ease: MOTION_EASE_SOFT,
          }}
        >
          <Link
            href={`/blog/${post.slug}`}
            className="blog-card group relative flex h-full min-h-[156px] flex-col overflow-hidden rounded-xl bg-card px-4 pb-4 pt-3.5 hover:-translate-y-2 hover:scale-[1.015] active:scale-[0.997]"
          >
            <div className="relative z-10 flex items-start gap-3">
              <p className="inline-flex rounded-full bg-background/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground/70">
                {formatDate(post.frontmatter.date)}
              </p>
            </div>
            <h2
              className="relative z-10 mt-3 font-mono text-[15px] font-medium leading-snug tracking-[0.01em] text-foreground transition-colors duration-300 group-hover:text-accent"
              style={{ textWrap: 'balance' }}
            >
              {post.frontmatter.title}
            </h2>
            <p
              className="relative z-10 mt-2 font-inter text-[13px] leading-relaxed text-muted-foreground"
              style={{ textWrap: 'pretty' }}
            >
              {post.frontmatter.description}
            </p>
            {post.frontmatter.tags && post.frontmatter.tags.length > 0 ? (
              <div className="relative z-10 mt-auto flex flex-wrap gap-1.5 pt-4">
                {post.frontmatter.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex rounded-full bg-secondary/60 px-2.5 py-1 font-mono text-[10px] tracking-[0.04em] text-muted-foreground"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            ) : (
              <div className="mt-auto pt-4" />
            )}
          </Link>
        </m.li>
      ))}
    </ul>
  )
}
