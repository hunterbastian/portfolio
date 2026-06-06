import assert from 'node:assert/strict'
import test from 'node:test'

import { SITE_METADATA_KEYWORDS, getSiteMetadata, getStaticPageMetadata } from './site-metadata.ts'

const config = {
  appName: 'Hunter Bastian Portfolio',
  brandName: 'Hunter Bastian',
  defaultOgImage: '/images/profilepicture.webp',
  faviconVersion: 'test-version',
  personName: 'Hunter Bastian',
  siteDescription: 'Design engineer portfolio.',
  siteTitle: 'Hunter Bastian - Design Engineer',
  studioName: 'Studio Alpine',
  themeColorDark: '#232527',
  url: 'https://hunterbastian.com',
}

test('getSiteMetadata builds root title, authors, and canonical metadata', () => {
  const metadata = getSiteMetadata(config, 'Hunter Bastian Portfolio')

  assert.equal(metadata.title, 'Hunter Bastian - Design Engineer')
  assert.equal(metadata.applicationName, 'Hunter Bastian Portfolio')
  assert.equal(metadata.description, 'Design engineer portfolio.')
  assert.deepEqual(metadata.keywords, SITE_METADATA_KEYWORDS)
  assert.deepEqual(metadata.authors, [{ name: 'Hunter Bastian', url: 'https://hunterbastian.com' }])
  assert.equal(metadata.creator, 'Hunter Bastian')
  assert.equal(metadata.publisher, 'Studio Alpine')
  assert.equal(metadata.metadataBase?.toString(), 'https://hunterbastian.com/')
  assert.deepEqual(metadata.alternates, { canonical: 'https://hunterbastian.com' })
})

test('getSiteMetadata keeps favicon URLs versioned', () => {
  const metadata = getSiteMetadata(config, 'Hunter Bastian Portfolio')

  assert.deepEqual(metadata.icons?.icon, [
    { url: '/favicon/favicon.svg?v=test-version', sizes: 'any', type: 'image/svg+xml' },
    { url: '/favicon.ico?v=test-version', sizes: 'any' },
    { url: '/favicon/favicon-16x16.png?v=test-version', sizes: '16x16', type: 'image/png' },
    { url: '/favicon/favicon-32x32.png?v=test-version', sizes: '32x32', type: 'image/png' },
    { url: '/favicon/favicon.ico?v=test-version', sizes: 'any' },
  ])
  assert.deepEqual(metadata.icons?.apple, [
    { url: '/favicon/apple-touch-icon.png?v=test-version', sizes: '180x180', type: 'image/png' },
  ])
  assert.deepEqual(metadata.icons?.other, [
    { rel: 'mask-icon', url: '/favicon/favicon.svg?v=test-version', color: '#232527' },
    { url: '/favicon/favicon-192x192.png?v=test-version', sizes: '192x192', type: 'image/png' },
    { url: '/favicon/favicon-512x512.png?v=test-version', sizes: '512x512', type: 'image/png' },
  ])
})

test('getSiteMetadata builds social preview metadata', () => {
  const metadata = getSiteMetadata(config, 'Hunter Bastian Portfolio')

  assert.deepEqual(metadata.openGraph, {
    type: 'website',
    locale: 'en_US',
    url: 'https://hunterbastian.com',
    title: 'Hunter Bastian - Design Engineer',
    description: 'Design engineer portfolio.',
    siteName: 'Hunter Bastian Portfolio',
    images: [
      {
        url: '/images/profilepicture.webp',
        width: 1200,
        height: 630,
        alt: 'Hunter Bastian Portfolio - design engineer portfolio',
      },
    ],
  })
  assert.deepEqual(metadata.twitter, {
    card: 'summary_large_image',
    title: 'Hunter Bastian - Design Engineer',
    description: 'Design engineer portfolio.',
    creator: '@thestudioalpine',
    images: ['/images/profilepicture.webp'],
  })
})

test('getSiteMetadata defaults to the production site config', () => {
  const metadata = getSiteMetadata()

  assert.equal(metadata.title, 'Hunter Bastian - Design Engineer')
  assert.equal(metadata.metadataBase?.toString(), 'https://hunterbastian.com/')
})

test('getStaticPageMetadata builds repeated route metadata with absolute title support', () => {
  assert.deepEqual(
    getStaticPageMetadata({
      absoluteTitle: true,
      description: 'LEHI UT',
      image: '/opengraph-image',
      imageAlt: 'Hunter Bastian LEHI UT',
      openGraphType: 'website',
      path: '/',
      siteName: 'Hunter Bastian',
      title: 'Hunter Bastian',
    }),
    {
      title: { absolute: 'Hunter Bastian' },
      description: 'LEHI UT',
      alternates: {
        canonical: 'https://hunterbastian.com/',
      },
      openGraph: {
        title: 'Hunter Bastian',
        description: 'LEHI UT',
        url: 'https://hunterbastian.com/',
        siteName: 'Hunter Bastian',
        type: 'website',
        images: [
          {
            url: '/opengraph-image',
            width: 1200,
            height: 630,
            alt: 'Hunter Bastian LEHI UT',
          },
        ],
      },
      twitter: {
        card: 'summary_large_image',
        title: 'Hunter Bastian',
        description: 'LEHI UT',
        images: ['/opengraph-image'],
      },
    },
  )
})

test('getStaticPageMetadata supports robots and default social image', () => {
  const metadata = getStaticPageMetadata({
    description: 'Browse side projects.',
    openGraphType: 'website',
    path: '/archive',
    robots: {
      index: false,
      follow: true,
    },
    site: config,
    siteName: 'Hunter Bastian Portfolio',
    title: 'Playground | Hunter Bastian Portfolio',
  })

  assert.equal(metadata.title, 'Playground | Hunter Bastian Portfolio')
  assert.deepEqual(metadata.robots, { index: false, follow: true })
  assert.deepEqual(metadata.alternates, { canonical: 'https://hunterbastian.com/archive' })
  assert.deepEqual(metadata.openGraph, {
    title: 'Playground | Hunter Bastian Portfolio',
    description: 'Browse side projects.',
    url: 'https://hunterbastian.com/archive',
    siteName: 'Hunter Bastian Portfolio',
    type: 'website',
    images: [
      {
        url: '/images/profilepicture.webp',
        width: 1200,
        height: 630,
        alt: 'Hunter Bastian Portfolio',
      },
    ],
  })
})
