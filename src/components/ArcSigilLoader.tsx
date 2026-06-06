'use client'

import { useCallback, useMemo, useState } from 'react'
import {
  ARC_SIGIL_DOWNLOAD_ACTIONS,
  ARC_SIGIL_DOWNLOAD_FILES,
  ARC_SIGIL_EXPORT_SIZES,
  ARC_SIGIL_DOWNLOAD_BUTTON_CLASS,
  ARC_SIGIL_LOADER_FRAME_CLASS,
  buildArcSigilLinkedInSvgMarkup,
  buildArcSigilLogoSvgMarkup,
  getArcSigilLoaderClassName,
  getArcSigilLoaderSizeStyle,
} from '@/lib/arc-sigil'

interface ArcSigilLoaderProps {
  size?: number
  className?: string
  downloadable?: boolean
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
  const [isExporting, setIsExporting] = useState(false)

  const logoSvg = useMemo(() => buildArcSigilLogoSvgMarkup(), [])
  const linkedInSvg = useMemo(() => buildArcSigilLinkedInSvgMarkup(), [])

  const downloadSvg = useCallback(() => {
    triggerDownload(new Blob([logoSvg], { type: 'image/svg+xml;charset=utf-8' }), ARC_SIGIL_DOWNLOAD_FILES.logoSvg)
  }, [logoSvg])

  const downloadLogoPng = useCallback(async () => {
    setIsExporting(true)
    try {
      const { width, height } = ARC_SIGIL_EXPORT_SIZES.logoPng
      const blob = await renderPngFromSvg(logoSvg, width, height)
      triggerDownload(blob, ARC_SIGIL_DOWNLOAD_FILES.logoPng)
    } finally {
      setIsExporting(false)
    }
  }, [logoSvg])

  const downloadLinkedInPng = useCallback(async () => {
    setIsExporting(true)
    try {
      const { width, height } = ARC_SIGIL_EXPORT_SIZES.linkedInPng
      const blob = await renderPngFromSvg(linkedInSvg, width, height)
      triggerDownload(blob, ARC_SIGIL_DOWNLOAD_FILES.linkedInPng)
    } finally {
      setIsExporting(false)
    }
  }, [linkedInSvg])

  const downloadHandlers = {
    linkedInPng: downloadLinkedInPng,
    logoPng: downloadLogoPng,
    logoSvg: downloadSvg,
  } as const

  return (
    <div className={getArcSigilLoaderClassName(className)} aria-label="Loading">
      <div
        className={ARC_SIGIL_LOADER_FRAME_CLASS}
        style={getArcSigilLoaderSizeStyle(size)}
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
          {ARC_SIGIL_DOWNLOAD_ACTIONS.map((action) => (
            <button
              key={action.id}
              type="button"
              className={ARC_SIGIL_DOWNLOAD_BUTTON_CLASS}
              onClick={() => {
                void downloadHandlers[action.id]()
              }}
              disabled={isExporting}
            >
              {action.label}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
