import { ImageResponse } from 'next/og'
import { getProjectBySlug, getAllProjects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'
import { getOgFonts } from '@/lib/og-fonts'
import { OG_COLORS } from '@/lib/og-colors'

export const runtime = 'nodejs'
export const alt = 'Project preview'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export function generateStaticParams() {
  return getAllProjects().map((p) => ({ slug: p.slug }))
}

export default async function OgImage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const project = getProjectBySlug(slug)

  const title = project?.frontmatter.displayTitle ?? project?.frontmatter.title ?? slug
  const category = project?.frontmatter.category ?? ''

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
        {/* Top — branding */}
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
            {siteConfig.brandName}
          </span>
        </div>

        {/* Center — title + category */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <span
            style={{
              fontSize: title.length > 30 ? '42px' : '52px',
              fontWeight: 500,
              color: OG_COLORS.foreground,
              lineHeight: 1.15,
              letterSpacing: '0.01em',
            }}
          >
            {title}
          </span>
          {category && (
            <div style={{ display: 'flex' }}>
              <span
                style={{
                  fontSize: '14px',
                  letterSpacing: '0.06em',
                  color: OG_COLORS.foreground,
                  background: `${OG_COLORS.foreground}0F`,
                  padding: '6px 14px',
                  borderRadius: '3px',
                  fontWeight: 400,
                }}
              >
                {category}
              </span>
            </div>
          )}
        </div>

        {/* Bottom — coordinates */}
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
            {siteConfig.siteCoordinates}
          </span>
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: OG_COLORS.muted,
              fontWeight: 400,
            }}
          >
            {siteConfig.siteLocation}
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
