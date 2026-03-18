import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import mdxComponents from '@/components/mdx/MDXComponents'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import BreadcrumbPill from '@/components/BreadcrumbPill'

export const revalidate = 300

interface BlogPostPageProps {
  params: Promise<{ slug: string }>
}

function formatDate(dateValue: string): string {
  const parsed = new Date(dateValue)
  if (Number.isNaN(parsed.getTime())) return dateValue
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  }).format(parsed)
}

export async function generateStaticParams() {
  const posts = getAllPosts()
  return posts.map((post) => ({ slug: post.slug }))
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) return {}

  return {
    title: `${post.frontmatter.title} | ${sitePortfolioName}`,
    description: post.frontmatter.description,
    openGraph: {
      type: 'article',
      title: post.frontmatter.title,
      description: post.frontmatter.description,
      url: resolveSiteUrl(`/blog/${slug}`),
      siteName: sitePortfolioName,
      publishedTime: post.frontmatter.date,
      authors: [siteConfig.brandName],
    },
    alternates: {
      canonical: resolveSiteUrl(`/blog/${slug}`),
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  return (
    <article className="container mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6">
      <div className="mb-8 sm:mb-12 flex justify-start">
        <BreadcrumbPill href="/blog" parentLabel="Blog" currentLabel={post.frontmatter.title} />
      </div>

      <div className="mx-auto max-w-[560px]">
        <header className="mb-12">
          <p className="font-mono text-[11px] tracking-[0.06em] text-muted-foreground">
            {formatDate(post.frontmatter.date)}
          </p>
          <h1 className="mt-2 font-mono text-lg font-medium tracking-[0.01em] text-foreground sm:text-2xl">
            {post.frontmatter.title}
          </h1>
        </header>

        <div className="prose dark:prose-invert max-w-none font-inter text-[13px] [&_li]:font-inter [&_ol]:font-inter [&_p]:font-inter [&_p]:text-[13px] [&_ul]:font-inter [&_li]:text-[13px] [&_h2]:font-mono [&_h3]:font-mono [&_h4]:font-mono">
          <MDXRemote source={post.content} components={mdxComponents} />
        </div>
      </div>
    </article>
  )
}
