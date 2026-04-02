import { getAllPosts } from '@/lib/blog'
import { resolveSiteUrl, siteConfig, sitePortfolioName } from '@/lib/site'
import BreadcrumbPill from '@/components/BreadcrumbPill'
import BlogCardList from '@/components/BlogCardList'
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
          <BlogCardList posts={posts} />
        )}
      </div>
    </div>
  )
}
