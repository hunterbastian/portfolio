import { ImageResponse } from 'next/og'
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

import { HOME_SHOWCASE_LOCATION, HOME_SHOWCASE_ROLE, SHOWCASE_WEBSITE_PROJECT_LINE } from './home-showcase.ts'
import { siteConfig } from './site.ts'

export const SHOWCASE_OG_SIZE = { width: 1200, height: 630 } as const
export const SHOWCASE_OG_CONTENT_TYPE = 'image/png'

const CANVAS = '#F7F7F5'
const INK = '#0E0E0D'
const MUTED = '#84847F'
const LINE = '#E4E4E0'
const CAPTION = 'Calm interfaces, thoughtful motion.'
const RENDER_PATH = path.join(process.cwd(), 'public/showcase/lumo-transparent.webp')
const FONT_PATH = path.join(process.cwd(), 'public/fonts/inter-latin-500.ttf')

interface ShowcaseOgOptions {
  pageLabel?: string
}

let cachedFont: ArrayBuffer | null = null
let cachedRender: string | null = null

function toArrayBuffer(buffer: Buffer): ArrayBuffer {
  return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength) as ArrayBuffer
}

async function loadShowcaseOgAssets() {
  if (!cachedFont) {
    cachedFont = toArrayBuffer(await fs.readFile(FONT_PATH))
  }

  if (!cachedRender) {
    const png = await sharp(RENDER_PATH).resize({ width: 1100, withoutEnlargement: true }).png().toBuffer()
    cachedRender = `data:image/png;base64,${png.toString('base64')}`
  }

  return { font: cachedFont, render: cachedRender }
}

export function getShowcaseOgAlt(pageLabel?: string) {
  if (!pageLabel) return `${siteConfig.personName}, ${HOME_SHOWCASE_ROLE} in ${HOME_SHOWCASE_LOCATION}`
  return `${pageLabel} — ${siteConfig.personName}`
}

export async function renderCardsOgImage(pageLabel?: string) {
  const font = toArrayBuffer(await fs.readFile(FONT_PATH))
  const hire = SHOWCASE_WEBSITE_PROJECT_LINE

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          backgroundColor: '#0E0E0D',
          color: '#EDEBE6',
          fontFamily: 'Inter',
          padding: '72px',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            fontSize: '18px',
            fontWeight: 500,
            letterSpacing: '0.16em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          <span>{siteConfig.personName}</span>
          <span style={{ color: '#8F8D88' }}>{pageLabel ?? HOME_SHOWCASE_LOCATION}</span>
        </div>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            maxWidth: '980px',
          }}
        >
          <span
            style={{
              fontSize: '36px',
              fontWeight: 500,
              letterSpacing: '-0.02em',
              lineHeight: 1.35,
            }}
          >
            {siteConfig.siteDescription}
          </span>
          <span
            style={{
              marginTop: '28px',
              color: '#8F8D88',
              fontSize: '24px',
              fontWeight: 500,
              letterSpacing: '-0.01em',
              lineHeight: 1.4,
            }}
          >
            {hire}
          </span>
        </div>
        <span
          style={{
            color: '#8F8D88',
            fontSize: '16px',
            fontWeight: 500,
            letterSpacing: '0.16em',
            lineHeight: 1,
            textTransform: 'uppercase',
          }}
        >
          {HOME_SHOWCASE_ROLE}
        </span>
      </div>
    ),
    {
      ...SHOWCASE_OG_SIZE,
      fonts: [
        {
          name: 'Inter',
          data: font,
          weight: 500,
          style: 'normal',
        },
      ],
    },
  )
}

export async function renderShowcaseOgImage({ pageLabel }: ShowcaseOgOptions = {}) {
  const { font, render } = await loadShowcaseOgAssets()

  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: CANVAS,
          color: INK,
          fontFamily: 'Inter',
          padding: '64px 72px 48px',
        }}
      >
        <div
          style={{
            display: 'flex',
            flex: 1,
            alignItems: 'center',
            minHeight: 0,
          }}
        >
          <div
            style={{
              width: '460px',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {pageLabel ? (
              <span
                style={{
                  marginBottom: '22px',
                  color: MUTED,
                  fontSize: '16px',
                  fontWeight: 500,
                  letterSpacing: '0.18em',
                  lineHeight: 1,
                  textTransform: 'uppercase',
                }}
              >
                {pageLabel}
              </span>
            ) : null}
            <span
              style={{
                fontSize: '52px',
                fontWeight: 500,
                letterSpacing: '0.045em',
                lineHeight: 0.95,
                textTransform: 'uppercase',
              }}
            >
              {siteConfig.personName}
            </span>
            <span
              style={{
                marginTop: '26px',
                fontSize: '20px',
                fontWeight: 500,
                letterSpacing: '0.16em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              {HOME_SHOWCASE_ROLE}
            </span>
            <span
              style={{
                marginTop: '12px',
                color: MUTED,
                fontSize: '20px',
                fontWeight: 500,
                letterSpacing: '0.16em',
                lineHeight: 1,
                textTransform: 'uppercase',
              }}
            >
              {HOME_SHOWCASE_LOCATION}
            </span>
            <span
              style={{
                marginTop: '36px',
                color: MUTED,
                fontSize: '18px',
                fontWeight: 500,
                letterSpacing: '0.04em',
                lineHeight: 1,
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {CAPTION}
            </span>
          </div>

          <div
            style={{
              width: '1px',
              alignSelf: 'stretch',
              margin: '8px 40px',
              backgroundColor: LINE,
            }}
          />

          <div
            style={{
              display: 'flex',
              flex: 1,
              height: '100%',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {/* Satori paints a native img. next/image cannot run inside ImageResponse. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={render}
              alt=""
              width={560}
              height={420}
              style={{
                width: '560px',
                height: '420px',
                objectFit: 'contain',
              }}
            />
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            marginTop: '28px',
          }}
        >
          <div
            style={{
              width: '100%',
              height: '1px',
              backgroundColor: LINE,
            }}
          />
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '16px',
          }}
        >
          <span
            style={{
              color: MUTED,
              fontSize: '15px',
              fontWeight: 500,
              letterSpacing: '0.18em',
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
          >
            hunterbastian.com
          </span>
        </div>
      </div>
    ),
    {
      ...SHOWCASE_OG_SIZE,
      fonts: [
        {
          name: 'Inter',
          data: font,
          weight: 500,
          style: 'normal',
        },
      ],
    },
  )
}
