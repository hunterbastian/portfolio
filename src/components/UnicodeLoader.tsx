'use client'

import { useEffect, useState } from 'react'
import { spinners } from 'unicode-animations'
import {
  activateUnicodeLoaderFrameLoop,
  getUnicodeLoaderClassName,
} from '@/lib/unicode-loader'

type SpinnerName = keyof typeof spinners

interface UnicodeLoaderProps {
  spinner?: SpinnerName
  className?: string
}

export default function UnicodeLoader({ spinner = 'breathe', className = '' }: UnicodeLoaderProps) {
  const [frameIndex, setFrameIndex] = useState(0)
  const anim = spinners[spinner]

  useEffect(() => {
    return activateUnicodeLoaderFrameLoop<number>({
      clearInterval: (timer) => window.clearInterval(timer),
      frameCount: anim.frames.length,
      intervalMs: anim.interval,
      scheduleInterval: (callback, intervalMs) => window.setInterval(callback, intervalMs),
      setFrameIndex,
    })
  }, [anim])

  return (
    <div className={getUnicodeLoaderClassName(className)}>
      <div className="absolute inset-0 bg-white/70 backdrop-blur-xl" />
      <div className="relative z-10 flex flex-col items-center gap-5">
        <span
          className="font-mono text-[28px] leading-none text-black select-none"
          aria-label="Loading"
          role="status"
        >
          {anim.frames[frameIndex]}
        </span>
        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-black/40 select-none">
          HB
        </span>
      </div>
    </div>
  )
}
