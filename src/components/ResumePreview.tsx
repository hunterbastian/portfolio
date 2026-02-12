'use client'

import { type RefObject, useEffect, useState } from 'react'
import { createPortal } from 'react-dom'

interface ResumePreviewProps {
  isVisible: boolean
  anchorRef?: RefObject<HTMLElement | null>
}

const PREVIEW_WIDTH = 170
const PREVIEW_HEIGHT = 220

export default function ResumePreview({ isVisible, anchorRef }: ResumePreviewProps) {
  const [mounted, setMounted] = useState(false)
  const [position, setPosition] = useState({ left: 0, top: 0 })

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    if (!isVisible || !anchorRef?.current) {
      return
    }

    const updatePosition = () => {
      const target = anchorRef.current
      if (!target) {
        return
      }

      const rect = target.getBoundingClientRect()
      const viewportPadding = 12
      const centeredLeft = rect.left + rect.width / 2
      const minLeft = viewportPadding + PREVIEW_WIDTH / 2
      const maxLeft = window.innerWidth - viewportPadding - PREVIEW_WIDTH / 2

      setPosition({
        left: Math.min(maxLeft, Math.max(minLeft, centeredLeft)),
        top: rect.bottom + 8,
      })
    }

    updatePosition()
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isVisible, anchorRef])

  const previewBody = (
    <div
      className="relative bg-white border border-gray-300 rounded-lg shadow-2xl overflow-hidden"
      style={{ width: `${PREVIEW_WIDTH}px`, height: `${PREVIEW_HEIGHT}px` }}
    >
      <div className="bg-gray-100 px-3 py-2 border-b border-gray-200">
        <div className="text-[8px] font-semibold text-gray-700">HUNTER BASTIAN</div>
        <div className="text-[6px] text-gray-500">Resume Preview</div>
      </div>

      <div className="p-3 space-y-2">
        <div className="space-y-1">
          <div className="h-1 bg-gray-800 rounded w-3/4"></div>
          <div className="h-0.5 bg-gray-400 rounded w-full"></div>
          <div className="h-0.5 bg-gray-400 rounded w-5/6"></div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-1/2"></div>
          <div className="space-y-0.5">
            <div className="h-0.5 bg-gray-300 rounded w-full"></div>
            <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
            <div className="h-0.5 bg-gray-300 rounded w-3/4"></div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-1/3"></div>
          <div className="flex gap-1">
            <div className="h-3 w-6 bg-blue-200 rounded text-[4px] flex items-center justify-center">JS</div>
            <div className="h-3 w-8 bg-green-200 rounded text-[4px] flex items-center justify-center">React</div>
            <div className="h-3 w-6 bg-purple-200 rounded text-[4px] flex items-center justify-center">TS</div>
          </div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-2/5"></div>
          <div className="h-0.5 bg-gray-300 rounded w-4/5"></div>
          <div className="h-0.5 bg-gray-300 rounded w-3/5"></div>
        </div>

        <div className="space-y-1">
          <div className="h-0.5 bg-gray-600 rounded w-1/4"></div>
          <div className="h-0.5 bg-gray-300 rounded w-2/3"></div>
        </div>
      </div>

      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2">
        <div className="text-[6px] text-gray-400">Click to view full resume</div>
      </div>
    </div>
  )

  const motionClasses = `pointer-events-none origin-top transition-transform transition-opacity duration-[420ms] ease-out ${
    isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 -translate-y-1 scale-95'
  }`

  if (mounted && anchorRef?.current) {
    return createPortal(
      <div
        className={`fixed -translate-x-1/2 z-[80] ${motionClasses}`}
        aria-hidden={!isVisible}
        style={{ left: `${position.left}px`, top: `${position.top}px`, willChange: 'transform, opacity' }}
      >
        {previewBody}
      </div>,
      document.body
    )
  }

  return (
    <div
      className={`absolute left-1/2 top-full mt-2 -translate-x-1/2 z-50 ${motionClasses}`}
      aria-hidden={!isVisible}
      style={{ willChange: 'transform, opacity' }}
    >
      {previewBody}
    </div>
  )
}
