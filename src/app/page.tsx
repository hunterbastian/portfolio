import ErrorBoundary from '@/components/ErrorBoundary'
import CardsHome from '@/components/cards/CardsHome'
import { getCardsHomeBio } from '@/lib/cards-portfolio'
import { siteConfig } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

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
  return (
    <ErrorBoundary>
      <CardsHome />
    </ErrorBoundary>
  )
}
