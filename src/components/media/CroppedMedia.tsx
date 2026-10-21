import type { CSSProperties, ReactNode } from 'react'
import type { MediaCrop } from '@/lib/media-crops'
import './cropped-media.css'

interface CroppedMediaProps {
  children: ReactNode
  className?: string
  spec: MediaCrop
}

export default function CroppedMedia({ children, className = '', spec }: CroppedMediaProps) {
  const style = {
    '--crop-x': spec.crop.x,
    '--crop-y': spec.crop.y,
    '--crop-w': spec.crop.w,
    '--crop-h': spec.crop.h,
    '--shot-aspect': spec.aspect,
    aspectRatio: spec.aspect,
  } as CSSProperties

  return (
    <div
      className={`cropped-media ${className}`.trim()}
      data-fit={spec.fit ?? 'fill'}
      data-shape={spec.shape}
      style={style}
    >
      {children}
    </div>
  )
}
