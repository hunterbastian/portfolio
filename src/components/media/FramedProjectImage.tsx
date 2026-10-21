import ImageViewer from '@/components/ImageViewer'
import { deviceImageSizes, type DeviceFrameSpec } from '@/lib/device-frames'
import BlurImage from './BlurImage'
import DeviceFrame from './DeviceFrame'

interface FramedProjectImageProps {
  src: string
  alt: string
  spec: DeviceFrameSpec
  priority?: boolean
  quality?: number
}

export default function FramedProjectImage({ src, alt, spec, priority = false, quality }: FramedProjectImageProps) {
  const frame = (presentation: 'inline' | 'enlarged') => (
    <DeviceFrame spec={spec}>
      <BlurImage
        src={src}
        alt={alt}
        fill
        sizes={deviceImageSizes(spec, presentation)}
        priority={priority}
        quality={quality}
      />
    </DeviceFrame>
  )

  return (
    <ImageViewer
      src={src}
      alt={alt}
      className="project-device-trigger"
      preview={<div className="project-device-stage project-device-stage-enlarged">{frame('enlarged')}</div>}
    >
      {frame('inline')}
    </ImageViewer>
  )
}
