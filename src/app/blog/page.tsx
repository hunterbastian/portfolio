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

      <div className="mx-auto max-w-[560px]">
        {posts.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground" style={{ fontFamily: 'inherit' }}>
            Nothing here yet. Check back soon.
          </p>
        ) : (
          <ul className="space-y-8">
            {posts.map((post) => (
              <li key={post.slug}>
                <Link
                  href={`/blog/${post.slug}`}
                  className="group block"
                >
                  <p className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
                    {formatDate(post.frontmatter.date)}
                  </p>
                  <h2 className="mt-1 font-mono text-[15px] font-medium tracking-[0.01em] text-foreground group-hover:text-foreground/80 transition-colors duration-200">
                    {post.frontmatter.title}
                  </h2>
                  <p className="mt-1.5 font-inter text-[13px] leading-relaxed text-muted-foreground">
                    {post.frontmatter.description}
                  </p>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  )
}
