import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import './viewport.css'
import Footer from '@/components/Footer'
import ProgressiveBlur from '@/components/ProgressiveBlur'
import ScrollToTop from '@/components/ScrollToTop'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import PageTransition from '@/components/PageTransition'
import SmoothScroll from '@/components/SmoothScroll'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import type { ReactNode } from 'react'
import MotionProvider from '@/components/MotionProvider'
import ProjectTransitionOverlay from '@/components/ProjectTransitionOverlay'
import { Agentation } from 'agentation'
import TopMeta from '@/components/TopMeta'
import { siteConfig, sitePortfolioName } from '@/lib/site'
import { telemetryConfig } from '@/lib/telemetry'
// Primary body font
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-inter',
  display: 'swap',
  preload: true,
  fallback: ['system-ui', 'sans-serif'],
})

// Geist Mono — used for all non-paragraph text (headings, nav, labels, buttons)


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

const faviconVersion = '20260327'

export const metadata: Metadata = {
  title: siteConfig.siteTitle,
  description: siteConfig.siteDescription,
  keywords: [siteConfig.brandName, 'developer', 'designer', 'portfolio', 'full-stack', 'React', 'Next.js'],
  authors: [{ name: siteConfig.brandName }],
  creator: siteConfig.brandName,
  metadataBase: new URL(siteConfig.url),

  icons: {
    icon: [
      { url: `/favicon/favicon-16x16.png?v=${faviconVersion}`, sizes: '16x16', type: 'image/png' },
      { url: `/favicon/favicon-32x32.png?v=${faviconVersion}`, sizes: '32x32', type: 'image/png' },
      { url: `/favicon/favicon.ico?v=${faviconVersion}`, sizes: 'any' },
    ],
    apple: [
      { url: `/favicon/apple-touch-icon.png?v=${faviconVersion}`, sizes: '180x180', type: 'image/png' },
    ],
    other: [
      { url: `/favicon/favicon-192x192.png?v=${faviconVersion}`, sizes: '192x192', type: 'image/png' },
      { url: `/favicon/favicon-512x512.png?v=${faviconVersion}`, sizes: '512x512', type: 'image/png' },
    ],
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: siteConfig.url,
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    siteName: sitePortfolioName,
    images: [
      {
        url: '/images/social/profile-preview.webp',
        width: 1200,
        height: 630,
        alt: `${siteConfig.brandName} - Designer & Developer Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.siteTitle,
    description: siteConfig.siteDescription,
    images: ['/images/social/profile-preview.webp'],
  },
  alternates: {
    canonical: siteConfig.url,
  },
}

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#f2f1ef" media="(prefers-color-scheme: light)" />
        <meta name="theme-color" content="#232527" media="(prefers-color-scheme: dark)" />

        {telemetryConfig.enableGa && telemetryConfig.gaId && (
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        )}

        {/* Structured Data - Person + Organization Schema for SEO
             All values are static string literals from siteConfig — no user input, safe for JSON.stringify. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                '@context': 'https://schema.org',
                '@type': 'Person',
                '@id': `${siteConfig.url}/#person`,
                name: 'Hunter Bastian',
                url: siteConfig.url,
                jobTitle: 'Interaction Designer',
                description: siteConfig.siteDescription,
                sameAs: [
                  'https://github.com/hunterbastian',
                  'https://linkedin.com/in/hunterbastian',
                  'https://x.com/thestudioalpine',
                  'https://instagram.com/studio.alpine',
                  'https://threads.net/@studio.alpine',
                  'https://youtube.com/@studio.alpine',
                ],
                knowsAbout: ['Interaction Design', 'UI Design', 'UX Design', 'React', 'Next.js', 'TypeScript', 'Photography', 'Creative Coding'],
              },
              {
                '@context': 'https://schema.org',
                '@type': 'Organization',
                '@id': `${siteConfig.url}/#organization`,
                name: 'Studio Alpine',
                url: 'https://instagram.com/studio.alpine',
                logo: `${siteConfig.url}/images/optimized/studio-alpine-logo.webp`,
                description: 'Photography and design studio founded by Hunter Bastian.',
                founder: { '@id': `${siteConfig.url}/#person` },
                foundingDate: '2026',
                sameAs: [
                  'https://instagram.com/studio.alpine',
                  'https://youtube.com/@studio.alpine',
                ],
              },
            ]),
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HB Portfolio" />
        
        {/* Resource Hints - Optimized for performance */}
        {telemetryConfig.enableSpeedInsights && (
          <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
        )}
        {telemetryConfig.enableVercelAnalytics && (
          <link rel="dns-prefetch" href="//analytics.vercel.com" />
        )}
        
        {/* Critical CSS + selection highlight (static strings, no user input) */}
        <style dangerouslySetInnerHTML={{
          __html: 'body{margin:0}.hero-section{min-height:0}.hero-section h1{line-height:1.2}::selection{background-color:rgba(35,131,226,.15)!important;color:inherit!important}::-moz-selection{background-color:rgba(35,131,226,.15)!important;color:inherit!important}'
        }} />
      </head>
      <body
        className={`${GeistMono.className} ${inter.variable} safe-area-padding text-foreground body-glow`}
        style={{
          backgroundColor: 'var(--background)',
          backgroundAttachment: 'fixed',
        }}
      >
        <MotionProvider>
          <ProjectTransitionOverlay />
          <TopMeta />
          <SmoothScroll>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-foreground"
            >
              Skip to content
            </a>
            <div className="min-h-screen flex flex-col">
              <main id="main-content" role="main" className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <ProgressiveBlur />
              <Footer />
              <ScrollToTop />
            </div>
            {telemetryConfig.enableSpeedInsights && (
              <SpeedInsights
                sampleRate={1}
              />
            )}
            {telemetryConfig.enableVercelAnalytics && <Analytics mode="production" />}
            {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
            {process.env.NODE_ENV === 'development' && <Agentation />}

            {/* Google Analytics - deferred to avoid blocking */}
            {telemetryConfig.enableGa && telemetryConfig.gaId && (
              <>
                <Script
                  src={`https://www.googletagmanager.com/gtag/js?id=${telemetryConfig.gaId}`}
                  strategy="afterInteractive"
                />
                <Script id="ga-init" strategy="afterInteractive">
                  {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${telemetryConfig.gaId}');`}
                </Script>
              </>
            )}

            {/* Service Worker Registration - Deferred for better performance */}
            {process.env.NODE_ENV === 'production' && (
              <Script
                id="sw-registration"
                strategy="lazyOnload"
              >
                {`
                  if ('serviceWorker' in navigator && 'requestIdleCallback' in window) {
                    requestIdleCallback(function() {
                      navigator.serviceWorker.register('/sw.js').catch(function() {});
                    }, { timeout: 5000 });
                  }
                `}
              </Script>
            )}
          </SmoothScroll>
        </MotionProvider>
      </body>
    </html>
  )
}
