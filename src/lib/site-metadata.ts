import type { Metadata } from 'next'
import { siteConfig, sitePortfolioName } from './site.ts'

interface SiteMetadataConfig {
  appName: string
  brandName: string
  defaultOgImage: string
  faviconVersion: string
  personName: string
  siteDescription: string
  siteTitle: string
  studioName: string
  themeColorDark: string
  url: string
}

interface StaticPageMetadataConfig {
  appName: string
  defaultOgImage: string
  url: string
}

interface StaticPageMetadataOptions {
  absoluteTitle?: boolean
  description: string
  image?: string
  imageAlt?: string
  openGraphType?: 'website'
  path: string
  robots?: Metadata['robots']
  site?: StaticPageMetadataConfig
  siteName: string
  title: string
}

export const SITE_METADATA_KEYWORDS = [
  'Hunter Bastian',
  'design engineer',
  'portfolio',
  'interaction design',
  'UI design',
  'web development',
  'React',
  'Next.js',
  'Three.js',
  'photographer',
  'Utah',
  'UVU',
] as const

export function getSiteMetadata(
  config: SiteMetadataConfig = siteConfig,
  portfolioName = sitePortfolioName,
): Metadata {
  const faviconVersion = config.faviconVersion

  return {
    title: config.siteTitle,
    applicationName: config.appName,
    description: config.siteDescription,
    keywords: [...SITE_METADATA_KEYWORDS],
    authors: [{ name: config.personName, url: config.url }],
    creator: config.personName,
    publisher: config.studioName,
    metadataBase: new URL(config.url),
    icons: {
      icon: [
        { url: `/favicon/favicon.svg?v=${faviconVersion}`, sizes: 'any', type: 'image/svg+xml' },
        { url: `/favicon.ico?v=${faviconVersion}`, sizes: 'any' },
        { url: `/favicon/favicon-16x16.png?v=${faviconVersion}`, sizes: '16x16', type: 'image/png' },
        { url: `/favicon/favicon-32x32.png?v=${faviconVersion}`, sizes: '32x32', type: 'image/png' },
        { url: `/favicon/favicon.ico?v=${faviconVersion}`, sizes: 'any' },
      ],
      shortcut: [
        { url: `/favicon.ico?v=${faviconVersion}` },
      ],
      apple: [
        { url: `/favicon/apple-touch-icon.png?v=${faviconVersion}`, sizes: '180x180', type: 'image/png' },
      ],
      other: [
        { rel: 'mask-icon', url: `/favicon/favicon.svg?v=${faviconVersion}`, color: config.themeColorDark },
        { url: `/favicon/favicon-192x192.png?v=${faviconVersion}`, sizes: '192x192', type: 'image/png' },
        { url: `/favicon/favicon-512x512.png?v=${faviconVersion}`, sizes: '512x512', type: 'image/png' },
      ],
    },
    openGraph: {
      type: 'website',
      locale: 'en_US',
      url: config.url,
      title: config.siteTitle,
      description: config.siteDescription,
      siteName: portfolioName,
      images: [
        {
          url: config.defaultOgImage,
          width: 1200,
          height: 630,
          alt: `${config.appName} - design engineer portfolio`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: config.siteTitle,
      description: config.siteDescription,
      creator: '@thestudioalpine',
      images: [config.defaultOgImage],
    },
    alternates: {
      canonical: config.url,
    },
  }
}

export function getStaticPageMetadata({
  absoluteTitle = false,
  description,
  image = siteConfig.defaultOgImage,
  imageAlt = siteConfig.appName,
  openGraphType,
  path,
  robots,
  site = siteConfig,
  siteName,
  title,
}: StaticPageMetadataOptions): Metadata {
  const canonical = resolveStaticPageCanonical(path, site.url)
  const metadataTitle = absoluteTitle ? { absolute: title } : title

  return {
    title: metadataTitle,
    description,
    ...(robots ? { robots } : {}),
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName,
      ...(openGraphType ? { type: openGraphType } : {}),
      images: [
        {
          url: image,
          width: 1200,
          height: 630,
          alt: imageAlt || site.appName,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [image],
    },
  }
}

function resolveStaticPageCanonical(path: string, url: string) {
  return new URL(path, url).toString()
}
