import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'
import { getOgFonts } from '@/lib/og-fonts'
import { OG_COLORS } from '@/lib/og-colors'

export const runtime = 'nodejs'
export const alt = 'Hunter Bastian Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
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
        {/* Top — accent dot + pixel HB signature */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '10px',
                height: '10px',
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
              Portfolio
            </span>
          </div>
          <svg
            width="28"
            height="28"
            viewBox="0 0 32 32"
            shapeRendering="crispEdges"
            style={{ opacity: 0.5 }}
          >
            <g fill={OG_COLORS.foreground}>
              <rect x="4" y="8" width="2" height="16" />
              <rect x="12" y="8" width="2" height="16" />
              <rect x="6" y="15" width="6" height="2" />
              <rect x="18" y="8" width="2" height="16" />
              <rect x="20" y="8" width="6" height="2" />
              <rect x="26" y="10" width="2" height="4" />
              <rect x="20" y="14" width="6" height="2" />
              <rect x="26" y="16" width="2" height="6" />
              <rect x="20" y="22" width="6" height="2" />
            </g>
          </svg>
        </div>

        {/* Center — name + role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span
            style={{
              fontSize: '56px',
              fontWeight: 500,
              color: OG_COLORS.foreground,
              lineHeight: 1.1,
              letterSpacing: '0.01em',
            }}
          >
            Hunter Bastian
          </span>
          <span
            style={{
              fontSize: '20px',
              fontWeight: 400,
              color: OG_COLORS.muted,
              letterSpacing: '0.02em',
            }}
          >
            {siteConfig.siteDescription}
          </span>
        </div>

        {/* Bottom — coordinates + location */}
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
