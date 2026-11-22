import { preload } from 'react-dom'

import ErrorBoundary from '@/components/ErrorBoundary'
import CardsHome from '@/components/cards/CardsHome'
import { getCardsHomeBio } from '@/lib/cards-portfolio'
import { siteConfig } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const KURONURI_LATIN_FONT = '/fonts/kuronuri/kuronuri-10-latin-400-normal.woff2'

const homeBio = getCardsHomeBio()
const previewDescription = `${homeBio.body} ${homeBio.hire}`

export const metadata = getStaticPageMetadata({
  absoluteTitle: true,
  description: previewDescription,
  image: '/opengraph-image',
  imageAlt: `${siteConfig.personName}, product designer in Lehi, Utah`,
  openGraphType: 'website',
  path: '/',
  siteName: siteConfig.personName,
  title: siteConfig.siteTitle,
})

export const revalidate = 60

export default function HomePage() {
  preload(KURONURI_LATIN_FONT, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })

  return (
    <ErrorBoundary>
      <CardsHome />
    </ErrorBoundary>
  )
}
