import type { Metadata } from 'next'
import { Inter, Playfair_Display } from 'next/font/google'
import { GeistMono } from 'geist/font/mono'
import './globals.css'
import './viewport.css'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import PageTransition from '@/components/PageTransition'
import SmoothScroll from '@/components/SmoothScroll'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import type { ReactNode } from 'react'
import MotionProvider from '@/components/MotionProvider'
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

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  weight: ['700'],
  variable: '--font-playfair-display',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'Times New Roman', 'serif'],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
}

const faviconVersion = '20260207'

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
        url: '/images/social/profile-preview.jpg',
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
    images: ['/images/social/profile-preview.jpg'],
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
        <meta name="theme-color" content="#f2f1ef" />

        {telemetryConfig.enableGa && telemetryConfig.gaId && (
          <>
            <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
            <script async src={`https://www.googletagmanager.com/gtag/js?id=${telemetryConfig.gaId}`} />
            <script
              dangerouslySetInnerHTML={{
                __html: `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${telemetryConfig.gaId}');`,
              }}
            />
          </>
        )}

        {/* Structured Data - Person Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: siteConfig.brandName,
              url: siteConfig.url,
              jobTitle: siteConfig.siteDescription,
              description: siteConfig.siteDescription,
              sameAs: [
                // Add your social profiles here
                // 'https://github.com/hunterbastian',
                // 'https://linkedin.com/in/hunterbastian',
                // 'https://twitter.com/hunterbastian',
              ],
              knowsAbout: ['React', 'Next.js', 'TypeScript', 'UI Design', 'UX Design', 'Web Development'],
            }),
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
      <body className={`${GeistMono.className} ${inter.variable} ${playfairDisplay.variable} safe-area-padding bg-background text-foreground`}>
        <MotionProvider>
          <TopMeta
            coordinates={siteConfig.siteCoordinates}
            location={siteConfig.siteLocation}
            season={siteConfig.siteSeason}
          />
          <SmoothScroll>
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-white focus:px-3 focus:py-2 focus:text-[#171717]"
            >
              Skip to content
            </a>
            <div className="min-h-screen flex flex-col">
              <main id="main-content" role="main" className="flex-1">
                <PageTransition>{children}</PageTransition>
              </main>
              <Footer />
              <ScrollToTop />
              <div
                className="pointer-events-none fixed inset-0 z-0 opacity-15"
                style={{
                  backgroundImage: 'radial-gradient(80% 30% at 50% 100%, #f59e0b 0%, transparent 100%)',
                }}
                aria-hidden="true"
              />
            </div>
            {telemetryConfig.enableSpeedInsights && (
              <SpeedInsights
                sampleRate={1}
              />
            )}
            {telemetryConfig.enableVercelAnalytics && <Analytics mode="production" />}
            {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}

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
