import { ImageResponse } from 'next/og'
import { getAllPosts, getPostBySlug } from '@/lib/blog'
import { siteConfig } from '@/lib/site'
import { getOgFonts } from '@/lib/og-fonts'
import { OG_COLORS } from '@/lib/og-colors'

export const runtime = 'nodejs'
export const alt = 'Blog post preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getAllPosts().map((p) => ({ slug: p.slug }))
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

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = getPostBySlug(slug)

  const title = post?.frontmatter.title ?? slug
  const date = post?.frontmatter.date ? formatDate(post.frontmatter.date) : ''

  const fonts = await getOgFonts()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          padding: '60px 64px',
          background: OG_COLORS.background,
          fontFamily: 'GeistMono',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: OG_COLORS.accent,
            }}
          />
          <span
            style={{
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: OG_COLORS.accent,
              fontWeight: 500,
            }}
          >
            Blog
          </span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span
            style={{
              fontSize: title.length > 40 ? '38px' : '48px',
              fontWeight: 500,
              color: OG_COLORS.foreground,
              lineHeight: 1.15,
              letterSpacing: '0.01em',
            }}
          >
            {title}
          </span>
          {date && (
            <span
              style={{
                fontSize: '14px',
                letterSpacing: '0.06em',
                color: OG_COLORS.muted,
                fontWeight: 400,
              }}
            >
              {date}
            </span>
          )}
        </div>

        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-end',
          }}
        >
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: OG_COLORS.muted,
              fontWeight: 400,
            }}
          >
            {siteConfig.brandName}
          </span>
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: OG_COLORS.muted,
              fontWeight: 400,
            }}
          >
            hunterbastian.com
          </span>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  )
}
