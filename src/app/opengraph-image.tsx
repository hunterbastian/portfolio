import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'

export const alt = 'Hunter Bastian Portfolio'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  const geistMonoMedium = fetch(
    new URL('../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Medium.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  const geistMonoRegular = fetch(
    new URL('../../node_modules/geist/dist/fonts/geist-mono/GeistMono-Regular.ttf', import.meta.url),
  ).then((res) => res.arrayBuffer())

  const [mediumFont, regularFont] = await Promise.all([geistMonoMedium, geistMonoRegular])

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
          background: '#f2f1ef',
          fontFamily: 'GeistMono',
        }}
      >
        {/* Top — accent dot */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '8px',
              height: '8px',
              borderRadius: '50%',
              background: '#7f8f81',
            }}
          />
          <span
            style={{
              fontSize: '13px',
              letterSpacing: '0.12em',
              textTransform: 'uppercase' as const,
              color: '#7f8f81',
              fontWeight: 500,
            }}
          >
            Portfolio
          </span>
        </div>

        {/* Center — name + role */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <span
            style={{
              fontSize: '56px',
              fontWeight: 500,
              color: '#171717',
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
              color: '#a09d98',
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
              color: '#a09d98',
              fontWeight: 400,
            }}
          >
            {siteConfig.siteCoordinates}
          </span>
          <span
            style={{
              fontSize: '11px',
              letterSpacing: '0.08em',
              color: '#a09d98',
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
      fonts: [
        { name: 'GeistMono', data: mediumFont, weight: 500 },
        { name: 'GeistMono', data: regularFont, weight: 400 },
      ],
    },
  )
}
