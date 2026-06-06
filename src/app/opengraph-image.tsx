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

const previewLine = 'Calm interfaces, thoughtful motion, visual restraint.'

export default async function OgImage() {
  const [fonts, grainSvg, gradientImage] = await Promise.all([
    getOgFonts(),
    fs.readFile(path.join(process.cwd(), 'public/images/hero-grain.svg'), 'utf8'),
    fs.readFile(path.join(process.cwd(), 'public/images/og/hunter-gradient-card.png')),
  ])
  const grainSrc = `data:image/svg+xml;base64,${Buffer.from(grainSvg).toString('base64')}`
  const gradientSrc = `data:image/png;base64,${Buffer.from(gradientImage).toString('base64')}`

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
          backgroundColor: '#f4f2ef',
          backgroundImage: [
            'radial-gradient(ellipse 42% 46% at 50% 18%, rgba(255, 253, 242, 0.82), transparent 72%)',
            'radial-gradient(ellipse 34% 42% at 30% 78%, rgba(226, 162, 132, 0.11), transparent 74%)',
            'radial-gradient(ellipse 34% 42% at 70% 76%, rgba(90, 154, 164, 0.09), transparent 74%)',
            'linear-gradient(180deg, #f8f5f1 0%, #f2f0ec 100%)',
          ].join(', '),
          color: '#2f2e2b',
          fontFamily: 'GeistPixelSquare',
        }}
      >
        <div
          style={{
            position: 'absolute',
            inset: 0,
            backgroundImage: `url(${grainSrc})`,
            backgroundSize: '260px 260px',
            opacity: 0.035,
          }}
        />
        <div
          style={{
            width: '724px',
            height: '420px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            padding: '22px',
            borderRadius: '26px',
            background: 'rgba(255, 254, 251, 0.9)',
            boxShadow:
              '0 1px 0 rgba(255,255,255,0.94), 0 16px 34px rgba(62, 56, 47, 0.045), 0 46px 94px rgba(56, 51, 42, 0.1), inset 0 0 0 1px rgba(55, 51, 43, 0.07), inset 0 1px 0 rgba(255,255,255,0.82)',
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: '28px',
              right: '28px',
              top: '16px',
              height: '1px',
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
            }}
          />
          <div
            style={{
              width: '680px',
              height: '266px',
              display: 'flex',
              position: 'relative',
              overflow: 'hidden',
              borderRadius: '18px',
              background: '#f4eee6',
              boxShadow:
                '0 1px 0 rgba(255,255,255,0.82), 0 18px 46px rgba(71, 66, 54, 0.12), inset 0 0 0 1px rgba(58,55,48,0.075), inset 0 1px 0 rgba(255,255,255,0.56)',
            }}
          >
            <img
              src={gradientSrc}
              width="680"
              height="266"
              alt=""
              style={{
                width: '680px',
                height: '266px',
                objectFit: 'cover',
              }}
            />
            <div
              style={{
                position: 'absolute',
                inset: 0,
                backgroundImage: `url(${grainSrc})`,
                backgroundSize: '160px 160px',
                opacity: 0.15,
              }}
            />
            <div
              style={{
                position: 'absolute',
                left: '18px',
                bottom: '16px',
                height: '28px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '0 11px',
                borderRadius: '999px',
                background: 'rgba(255, 254, 250, 0.78)',
                boxShadow: '0 6px 16px rgba(54,49,41,0.055), inset 0 0 0 1px rgba(55, 51, 43, 0.075)',
              }}
            >
              <span
                style={{
                  color: '#6b655e',
                  fontFamily: 'GeistMono',
                  fontSize: '12px',
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                Preview / 2026
              </span>
            </div>
          </div>

          <div
            style={{
              width: '680px',
              marginTop: '22px',
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
            }}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '30px',
                  fontWeight: 500,
                  lineHeight: 1,
                  letterSpacing: '-0.01em',
                }}
              >
                {siteConfig.personName}
              </span>
              <span
                style={{
                  color: '#706a63',
                  fontSize: '17px',
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                {previewLine}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-end',
                gap: '7px',
                paddingTop: '2px',
                fontFamily: 'GeistMono',
              }}
            >
              <span
                style={{
                  color: '#3d3a35',
                  fontSize: '14px',
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                Lehi, Utah
              </span>
              <span
                style={{
                  color: '#817b73',
                  fontSize: '13px',
                  fontWeight: 400,
                  lineHeight: 1,
                }}
              >
                Interaction Design / UVU
              </span>
            </div>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
      fonts,
    },
  )
}
