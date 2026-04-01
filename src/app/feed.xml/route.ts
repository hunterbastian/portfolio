import { getAllPosts } from '@/lib/blog'
import { siteConfig, resolveSiteUrl } from '@/lib/site'

export async function GET() {
  const posts = getAllPosts()

  const items = posts
    .map((post) => {
      const url = resolveSiteUrl(`/blog/${post.slug}`)
      const date = new Date(post.frontmatter.date).toUTCString()

      return `    <item>
      <title>${escapeXml(post.frontmatter.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <description>${escapeXml(post.frontmatter.description)}</description>
      <pubDate>${date}</pubDate>
      <author>${siteConfig.email} (Hunter Bastian)</author>
    </item>`
    })
    .join('\n')

  const feed = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(siteConfig.siteTitle)}</title>
    <link>${siteConfig.url}</link>
    <description>${escapeXml(siteConfig.siteDescription)}</description>
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${resolveSiteUrl('/feed.xml')}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`

  return new Response(feed, {
    headers: {
      'Content-Type': 'application/rss+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  })
}

function escapeXml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;')
}
