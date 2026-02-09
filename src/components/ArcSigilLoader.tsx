'use client'

import { useCallback, useMemo, useState } from 'react'

interface ArcSigilLoaderProps {
  size?: number
  className?: string
  downloadable?: boolean
}

const EXPORT_COLORS = {
  stroke: '#2e3440',
  accent: '#5e81ac',
  background: '#e5e9f0',
  panel: '#eceff4',
}

function getSigilGroupMarkup(stroke: string, accent: string) {
  return `
    <g fill="none" stroke="${stroke}" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="60" cy="60" r="44" stroke-width="1.4" />
      <circle cx="60" cy="60" r="30" stroke-width="1.0" opacity="0.45" />
      <path d="M24 42l72 36" stroke-width="0.8" opacity="0.22" />
      <path d="M20 66l80-12" stroke-width="0.8" opacity="0.18" />
      <line x1="60" y1="26" x2="60" y2="38" stroke-width="1.6" />
      <circle cx="60" cy="60" r="4.2" fill="${stroke}" stroke="none" opacity="0.95" />
    </g>
    <g fill="none" stroke="${accent}" stroke-linecap="round" stroke-linejoin="round">
      <path d="M90 48a32 32 0 0 1-4 24" stroke-width="2.1" />
      <path d="M84 34a44 44 0 0 1 8 22" stroke-width="1.5" opacity="0.7" />
      <circle cx="60" cy="16" r="2.1" fill="${accent}" stroke="none" />
      <circle cx="96" cy="62" r="2.1" fill="${accent}" stroke="none" />
    </g>
  `
}

function buildLogoSvgMarkup() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
      ${getSigilGroupMarkup(EXPORT_COLORS.stroke, EXPORT_COLORS.accent)}
    </svg>
  `.trim()
}

function buildLinkedInSvgMarkup() {
  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400" fill="none">
      <rect width="400" height="400" fill="${EXPORT_COLORS.background}" />
      <circle cx="200" cy="200" r="170" fill="${EXPORT_COLORS.panel}" />
      <g transform="translate(55 55) scale(2.4167)">
        ${getSigilGroupMarkup(EXPORT_COLORS.stroke, EXPORT_COLORS.accent)}
      </g>
    </svg>
  `.trim()
}

async function renderPngFromSvg(svgMarkup: string, width: number, height: number): Promise<Blob> {
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' })
  const svgUrl = URL.createObjectURL(svgBlob)

  try {
    const image = await new Promise<HTMLImageElement>((resolve, reject) => {
      const nextImage = new Image()
      nextImage.onload = () => resolve(nextImage)
      nextImage.onerror = () => reject(new Error('Unable to render SVG for download.'))
      nextImage.src = svgUrl
    })

    const canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height

    const context = canvas.getContext('2d')
    if (!context) {
      throw new Error('Canvas rendering is unavailable in this browser.')
    }

    context.clearRect(0, 0, width, height)
    context.drawImage(image, 0, 0, width, height)

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob)
          return
        }
        reject(new Error('Unable to export PNG.'))
      }, 'image/png')
    })

    return pngBlob
  } finally {
    URL.revokeObjectURL(svgUrl)
  }
}

function triggerDownload(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = fileName
  document.body.appendChild(link)
  link.click()
  link.remove()
  URL.revokeObjectURL(url)
}

export default function ArcSigilLoader({
  size = 96,
  className = '',
  downloadable = false,
}: ArcSigilLoaderProps) {
  const pixelSize = `${size}px`
  const [isExporting, setIsExporting] = useState(false)

  const logoSvg = useMemo(() => buildLogoSvgMarkup(), [])
  const linkedInSvg = useMemo(() => buildLinkedInSvgMarkup(), [])

  const downloadSvg = useCallback(() => {
    triggerDownload(new Blob([logoSvg], { type: 'image/svg+xml;charset=utf-8' }), 'hunter-logo.svg')
  }, [logoSvg])

  const downloadLogoPng = useCallback(async () => {
    setIsExporting(true)
    try {
      const blob = await renderPngFromSvg(logoSvg, 1200, 1200)
      triggerDownload(blob, 'hunter-logo.png')
    } finally {
      setIsExporting(false)
    }
  }, [logoSvg])

  const downloadLinkedInPng = useCallback(async () => {
    setIsExporting(true)
    try {
      const blob = await renderPngFromSvg(linkedInSvg, 400, 400)
      triggerDownload(blob, 'hunter-linkedin-logo-400x400.png')
    } finally {
      setIsExporting(false)
    }
  }, [linkedInSvg])

  return (
    <div className={`flex flex-col items-center justify-center gap-5 ${className}`} aria-label="Loading">
      <div
        className="relative isolate"
        style={{ width: pixelSize, height: pixelSize }}
      >
        <div className="absolute inset-0 rounded-full bg-[radial-gradient(circle,rgba(129,161,193,0.18),transparent_65%)] blur-[1px]" />

        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 text-foreground/70"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <circle cx="60" cy="60" r="44" strokeWidth="1.4" />
          <circle cx="60" cy="60" r="30" strokeWidth="1" opacity="0.45" />
          <path d="M24 42l72 36" strokeWidth="0.8" opacity="0.22" />
          <path d="M20 66l80-12" strokeWidth="0.8" opacity="0.18" />
          <line x1="60" y1="26" x2="60" y2="38" strokeWidth="1.6" />
          <circle cx="60" cy="60" r="4.2" fill="currentColor" stroke="none" opacity="0.95" />
        </svg>

        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 text-primary [animation:spin_2.8s_linear_infinite]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M90 48a32 32 0 0 1-4 24" strokeWidth="2.1" />
          <path d="M84 34a44 44 0 0 1 8 22" strokeWidth="1.5" opacity="0.7" />
          <circle cx="60" cy="16" r="2.1" fill="currentColor" stroke="none" />
          <circle cx="96" cy="62" r="2.1" fill="currentColor" stroke="none" />
        </svg>

        <svg
          viewBox="0 0 120 120"
          className="absolute inset-0 text-foreground/80 [animation:spin_10s_linear_infinite_reverse]"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
        >
          <circle cx="60" cy="60" r="37" strokeWidth="0.9" strokeDasharray="22 210" />
        </svg>

        <div className="absolute inset-0 [animation:spin_6.8s_linear_infinite]">
          <span className="absolute left-1/2 top-[14px] h-1.5 w-1.5 -translate-x-1/2 rounded-full bg-primary" />
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
          <span className="h-2 w-2 rounded-full bg-foreground/80 [animation:pulse_1.1s_ease-in-out_infinite]" />
        </div>
      </div>

      {downloadable && (
        <div className="flex flex-wrap items-center justify-center gap-2">
          <button
            type="button"
            className="nord-button rounded-md px-3 py-2 text-xs font-code tracking-[0.08em] uppercase"
            onClick={downloadSvg}
            disabled={isExporting}
          >
            Download SVG
          </button>
          <button
            type="button"
            className="nord-button rounded-md px-3 py-2 text-xs font-code tracking-[0.08em] uppercase"
            onClick={downloadLogoPng}
            disabled={isExporting}
          >
            Download PNG
          </button>
          <button
            type="button"
            className="nord-button rounded-md px-3 py-2 text-xs font-code tracking-[0.08em] uppercase"
            onClick={downloadLinkedInPng}
            disabled={isExporting}
          >
            LinkedIn 400x400
          </button>
        </div>
      )}
    </div>
  )
}
