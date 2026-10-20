import Image, { type ImageProps } from 'next/image'
import { getImageBlurDataUrl } from '@/lib/image-blur'

export default function BlurImage({ placeholder, blurDataURL, ...props }: ImageProps) {
  const src = props.src
  const resolvedBlur = blurDataURL ?? (typeof src === 'string' ? getImageBlurDataUrl(src) : undefined)

  if (!resolvedBlur || placeholder === 'empty') {
    return <Image placeholder={placeholder} blurDataURL={blurDataURL} {...props} />
  }

  return <Image {...props} placeholder="blur" blurDataURL={resolvedBlur} />
}
