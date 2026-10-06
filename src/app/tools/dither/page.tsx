import DitherStudio from '@/components/tools/DitherStudio'
import { getStaticPageMetadata } from '@/lib/site-metadata'
import { sitePortfolioName } from '@/lib/site'

export const metadata = getStaticPageMetadata({
  title: 'Dither Studio',
  description: 'Turn your photos into two-tone pixel prints. Adjust texture, contrast, and color, then export a PNG. A free browser tool by Hunter Bastian.',
  path: '/tools/dither',
  siteName: sitePortfolioName,
})

export default function DitherPage() {
  return <DitherStudio />
}
