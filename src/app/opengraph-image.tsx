import { ImageResponse } from 'next/og'
import { siteConfig } from '@/lib/site'
import { getOgFonts } from '@/lib/og-fonts'
import { Buffer } from 'node:buffer'
import fs from 'node:fs/promises'
import path from 'node:path'

export const runtime = 'nodejs'
export const alt = `${siteConfig.personName.toUpperCase()} ${siteConfig.siteLocation}`
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

const previewTitle = siteConfig.personName.toUpperCase()
const previewLocation = siteConfig.siteLocation.toUpperCase()

export default async function OgImage() {
  const [fonts, faviconSvg, grainSvg] = await Promise.all([
    getOgFonts(),
    fs.readFile(path.join(process.cwd(), 'public/favicon/favicon.svg'), 'utf8'),
    fs.readFile(path.join(process.cwd(), 'public/images/hero-grain.svg'), 'utf8'),
  ])
  const faviconSrc = `data:image/svg+xml;base64,${Buffer.from(faviconSvg).toString('base64')}`
  const grainSrc = `data:image/svg+xml;base64,${Buffer.from(grainSvg).toString('base64')}`

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'relative',
          overflow: 'hidden',
          backgroundColor: '#f3f0ea',
          backgroundImage: [
            'radial-gradient(ellipse 46% 52% at 19% 49%, rgba(255, 72, 0, 0.24) 0%, rgba(255, 103, 16, 0.16) 30%, rgba(255, 178, 66, 0.09) 54%, transparent 78%)',
            'radial-gradient(ellipse 42% 38% at 84% 82%, rgba(255, 185, 120, 0.15) 0%, rgba(255, 205, 152, 0.065) 34%, transparent 72%)',
            'radial-gradient(ellipse 52% 32% at 56% 7%, rgba(255, 242, 220, 0.46) 0%, transparent 72%)',
            'linear-gradient(180deg, #f8f4ed 0%, #f3f0ea 100%)',
          ].join(', '),
          fontFamily: 'GeistMono',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${grainSrc})`,
            backgroundSize: '250px 250px',
            opacity: 0.05,
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '74px',
            left: '128px',
            right: '128px',
            height: '1px',
            background: 'rgba(63, 61, 55, 0.10)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            left: '128px',
            right: '128px',
            bottom: '74px',
            height: '1px',
            background: 'rgba(63, 61, 55, 0.10)',
          }}
        />
        <div
          style={{
            position: 'relative',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '28px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '36px' }}>
            <img
              src={faviconSrc}
              width="120"
              height="120"
              alt=""
              style={{
                width: '120px',
                height: '120px',
              }}
            />
            <span
              style={{
                fontFamily: 'GeistMono',
                fontSize: '76px',
                fontWeight: 500,
                color: '#3f3d37',
                lineHeight: 0.95,
                letterSpacing: '0.065em',
              }}
            >
              {previewTitle}
            </span>
          </div>
          <span
            style={{
              fontFamily: 'GeistMono',
              fontSize: '24px',
              fontWeight: 400,
              color: '#837d74',
              lineHeight: 1,
              letterSpacing: '0.26em',
            }}
          >
            {previewLocation}
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
