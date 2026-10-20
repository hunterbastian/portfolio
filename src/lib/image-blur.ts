import { IMAGE_BLUR_DATA } from './image-blur-data.ts'

export function getImageBlurDataUrl(src: string): string | undefined {
  const path = src.split(/[?#]/, 1)[0] ?? src
  if (Object.prototype.hasOwnProperty.call(IMAGE_BLUR_DATA, path)) {
    return IMAGE_BLUR_DATA[path as keyof typeof IMAGE_BLUR_DATA]
  }

  return undefined
}
