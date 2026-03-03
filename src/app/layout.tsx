import type { Metadata } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './viewport.css'
import 'dialkit/styles.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import ScrollToTop from '@/components/ScrollToTop'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import PageTransition from '@/components/PageTransition'
import DialKitRoot from '@/components/DialKitRoot'
import SmoothScroll from '@/components/SmoothScroll'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import CursorFollower from '@/components/CursorFollower'
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

// Code blocks only
const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'monospace'],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover'
}

const faviconVersion = '20260207'
const brandName = 'Hunter Bastian // Studio Alpine'

export const metadata: Metadata = {
  title: `${brandName} - Portfolio`,
  description: 'Student Product Designer and Photographer',
  keywords: [brandName, 'developer', 'designer', 'portfolio', 'full-stack', 'React', 'Next.js'],
  authors: [{ name: brandName }],
  creator: brandName,
  metadataBase: new URL('https://hunterbastian.com'),

  icons: {
    icon: [
      { url: `/favicon/favicon-16x16.png?v=${faviconVersion}`, sizes: '16x16', type: 'image/png' },
      { url: `/favicon/favicon-32x32.png?v=${faviconVersion}`, sizes: '32x32', type: 'image/png' },
      { url: `/favicon/favicon.ico?v=${faviconVersion}`, sizes: 'any' }
    ],
    apple: [
      { url: `/favicon/apple-touch-icon.png?v=${faviconVersion}`, sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: `/favicon/favicon-192x192.png?v=${faviconVersion}`, sizes: '192x192', type: 'image/png' },
      { url: `/favicon/favicon-512x512.png?v=${faviconVersion}`, sizes: '512x512', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hunterbastian.com',
    title: `${brandName} - Portfolio`,
    description: 'Student Product Designer and Photographer',
    siteName: `${brandName} Portfolio`,
    images: [
      {
        url: '/images/social/profile-preview.jpg',
        width: 1200,
        height: 630,
        alt: `${brandName} - Designer & Developer Portfolio`,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${brandName} - Portfolio`,
    description: 'Student Product Designer and Photographer',
    images: ['/images/social/profile-preview.jpg'],
  },
  alternates: {
    canonical: 'https://hunterbastian.com',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#191919" />

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
              name: brandName,
              url: 'https://hunterbastian.com',
              jobTitle: 'Student Product Designer and Photographer',
              description: 'Student Product Designer and Photographer',
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
        
        {/* Critical CSS - Inline for faster FCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { margin: 0; font-family: 'Inter', system-ui, sans-serif; }
            .hero-section { min-height: 0; }
            .hero-section h1 { line-height: 1.2; }
          `
        }} />
        
        {/* Text selection highlight - Notion blue */}
        <style dangerouslySetInnerHTML={{
          __html: `
            ::selection {
              background-color: rgba(35, 131, 226, 0.15) !important;
              color: inherit !important;
            }
            ::-moz-selection {
              background-color: rgba(35, 131, 226, 0.15) !important;
              color: inherit !important;
            }
          `
        }} />
      </head>
                   <body className={`${inter.className} ${jetbrainsMono.variable} safe-area-padding bg-background text-foreground`}>
                <CursorFollower />
                <SmoothScroll>
                  <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
                  <div className="min-h-screen flex flex-col">
                    <Header />
                    <main id="main-content" role="main" className="flex-1">
                      <PageTransition>{children}</PageTransition>
                    </main>
                    <Footer />
                    <ScrollToTop />
                  </div>
                  {telemetryConfig.enableSpeedInsights && (
                    <SpeedInsights 
                      sampleRate={1}
                    />
                  )}
                  {telemetryConfig.enableVercelAnalytics && <Analytics mode="production" />}
                  {/* {process.env.NODE_ENV === 'development' && <DialKitRoot />} */}
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
                            navigator.serviceWorker.register('/sw.js')
                              .then(function(registration) {
                                console.log('SW registered: ', registration);
                              })
                              .catch(function(registrationError) {
                                console.log('SW registration failed: ', registrationError);
                              });
                          }, { timeout: 5000 });
                        }
                      `}
                    </Script>
                  )}
                </SmoothScroll>
              </body>
            </html>
          )
        }
