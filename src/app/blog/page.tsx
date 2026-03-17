import Link from 'next/link'
import { getAllPosts } from '@/lib/blog'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import IconArrowBackUp from '@/components/IconArrowBackUp'
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
  const posts = getAllPosts()

  return (
    <div className="container mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-16">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 font-mono text-[12px] tracking-[0.06em] text-muted-foreground hover:text-foreground"
        >
          <IconArrowBackUp size={12} className="shrink-0 opacity-60 transition-transform duration-200 ease-out group-hover:-translate-x-0.5" aria-hidden />
          <span className="text-foreground">Home</span>
          <span aria-hidden className="text-muted-foreground/70">/</span>
          <span>Blog</span>
        </Link>
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
                  className="group flex h-full min-h-[156px] flex-col rounded-[3px] bg-card/92 px-3.5 pb-3.5 pt-3 transition-[transform,box-shadow,background-color] duration-300 ease-[cubic-bezier(0.22,1,0.36,1)] hover:-translate-y-0.5 active:scale-[0.96]"
                  style={{
                    boxShadow: '0px 0px 0px 1px rgba(0, 0, 0, 0.05), 0px 1px 2px -1px rgba(0, 0, 0, 0.06), 0px 8px 20px -18px rgba(0, 0, 0, 0.18)',
                  }}
                >
                  <div className="flex items-start gap-3">
                    <p className="inline-flex rounded-full bg-background/72 px-2.5 py-1 font-mono text-[10px] tracking-[0.06em] text-muted-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.05)]">
                      {formatDate(post.frontmatter.date)}
                    </p>
                  </div>
                  <h2
                    className="mt-3 font-mono text-[15px] font-medium leading-snug tracking-[0.01em] text-foreground transition-colors duration-200 group-hover:text-foreground/80"
                    style={{ textWrap: 'balance' }}
                  >
                    {post.frontmatter.title}
                  </h2>
                  <p
                    className="mt-2 font-inter text-[13px] leading-relaxed text-muted-foreground"
                    style={{ textWrap: 'pretty' }}
                  >
                    {post.frontmatter.description}
                  </p>
                  {post.frontmatter.tags && post.frontmatter.tags.length > 0 ? (
                    <div className="mt-auto flex flex-wrap gap-1.5 pt-4">
                      {post.frontmatter.tags.slice(0, 3).map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full bg-secondary/85 px-2.5 py-1 font-mono text-[10px] tracking-[0.04em] text-muted-foreground shadow-[0_0_0_1px_rgba(0,0,0,0.04)]"
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
