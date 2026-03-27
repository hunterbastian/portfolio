import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: `Blog | ${sitePortfolioName}`,
  description: `Thoughts on design, development, and making things — by ${siteConfig.brandName}.`,
  openGraph: {
    title: `Blog - ${siteConfig.brandName}`,
    description: 'Thoughts on design, development, and making things.',
    url: resolveSiteUrl('/blog'),
    type: 'website',
  },
  alternates: {
    canonical: resolveSiteUrl('/blog'),
  },
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

export default function BlogPage() {
  let posts: ReturnType<typeof getAllPosts> = []
  try {
    posts = getAllPosts()
  } catch (e) {
    console.error('Failed to load blog posts:', e)
  }

  return (
    <div className="container mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-8 sm:mb-12">
        <BreadcrumbPill href="/" parentLabel="Home" currentLabel="Blog" />
      </div>

      <div className="mx-auto max-w-[700px]">
        {posts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground" style={{ fontFamily: 'inherit' }}>
            Nothing here yet. Check back soon.
          </p>
        ) : (
          <ul className="grid grid-cols-1 gap-2.5 sm:grid-cols-2 sm:gap-3">
            {posts.map((post) => (
              <li key={post.slug} className="h-full">
                <Link
                  href={`/blog/${post.slug}`}
                  className="blog-card group relative flex h-full min-h-[156px] flex-col overflow-hidden rounded-xl bg-card px-4 pb-4 pt-3.5 hover:-translate-y-2 hover:scale-[1.015] active:scale-[0.95]"
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
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
