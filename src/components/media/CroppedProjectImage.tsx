import ImageViewer from '@/components/ImageViewer'
import { mediaImageSizes, type MediaCrop } from '@/lib/media-crops'
import BlurImage from './BlurImage'
import CroppedMedia from './CroppedMedia'

interface CroppedProjectImageProps {
  src: string
  alt: string
  spec: MediaCrop
  priority?: boolean
  quality?: number
}

export default function CroppedProjectImage({ src, alt, spec, priority = false, quality }: CroppedProjectImageProps) {
  const picture = (presentation: 'inline' | 'enlarged') => (
    <CroppedMedia spec={spec}>
      <BlurImage
        src={src}
        alt={alt}
        fill
        sizes={mediaImageSizes(spec, presentation)}
        priority={priority}
        quality={quality}
      />
    </CroppedMedia>
  )

  return (
    <ImageViewer
      src={src}
      alt={alt}
      className="project-shot-trigger"
      preview={<div className="project-shot project-shot-enlarged">{picture('enlarged')}</div>}
    >
      {picture('inline')}
    </ImageViewer>
  )
}
