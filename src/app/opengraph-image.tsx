import { getShowcaseOgAlt, renderShowcaseOgImage, SHOWCASE_OG_CONTENT_TYPE, SHOWCASE_OG_SIZE } from '@/lib/showcase-og'

export const runtime = 'nodejs'
export const alt = getShowcaseOgAlt()
export const size = SHOWCASE_OG_SIZE
export const contentType = SHOWCASE_OG_CONTENT_TYPE

export default function OgImage() {
  return renderShowcaseOgImage()
}
