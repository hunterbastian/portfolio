'use client'

import { useState, type VideoHTMLAttributes } from 'react'
import BlurImage from '@/components/media/BlurImage'

interface ProjectVideoProps extends VideoHTMLAttributes<HTMLVideoElement> {
  poster?: string
}

export default function ProjectVideo({ poster, className = '', onCanPlay, onPlaying, ...props }: ProjectVideoProps) {
  const [ready, setReady] = useState(false)
  const markReady = () => setReady(true)

  return (
    <div className="project-video relative mb-8 mt-8 overflow-hidden bg-muted">
      {poster ? (
        <BlurImage
          src={poster}
          alt=""
          fill
          className="object-cover"
          sizes="(max-width: 608px) calc(100vw - 48px), 560px"
          aria-hidden
        />
      ) : null}
      <video
        {...props}
        poster={poster}
        data-ready={ready ? 'true' : undefined}
        onCanPlay={(event) => {
          markReady()
          onCanPlay?.(event)
        }}
        onPlaying={(event) => {
          markReady()
          onPlaying?.(event)
        }}
        className={`relative w-full transition-opacity duration-300 ease-out motion-reduce:transition-none ${ready ? 'opacity-100' : 'opacity-0'} ${className}`}
      />
    </div>
  )
}
