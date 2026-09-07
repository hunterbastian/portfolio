import { GeistMono } from 'geist/font/mono'
import { GeistPixelSquare } from 'geist/font/pixel'
import './globals.css'
import './playground.css'
import './viewport.css'
import './night.css'
import Footer from '@/components/Footer'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import PageTransition from '@/components/PageTransition'
import SmoothScroll from '@/components/SmoothScroll'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'
import type { ReactNode } from 'react'
import MotionProvider from '@/components/MotionProvider'
import { Agentation } from 'agentation'
import TopMeta from '@/components/TopMeta'
import JoyfulLayer from '@/components/JoyfulLayer'
import ScrollToTop from '@/components/ScrollToTop'
import HoverSoundCue from '@/components/HoverSoundCue'
import ProgressiveBlur from '@/components/ProgressiveBlur'
import { getLauncherProjectSources } from '@/lib/launcher'
import { getAllProjects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'
import { getSiteMetadata } from '@/lib/site-metadata'
import { SoundProvider } from '@/lib/sounds/context'
import { getSiteStructuredData } from '@/lib/structured-data'
import { telemetryConfig } from '@/lib/telemetry'
// Geist Mono is the site-wide text face; Geist Pixel Square is reserved for the top header.


export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover',
  colorScheme: 'dark',
  themeColor: siteConfig.themeColorDark,
}

const faviconVersion = siteConfig.faviconVersion

export const metadata = getSiteMetadata()

export default function RootLayout({
  children,
}: {
  children: ReactNode
}) {
  const launcherProjects = getLauncherProjectSources(getAllProjects())

  return (
    <html lang="en" className="dark" data-theme="dark" suppressHydrationWarning>
      <head>
        <link rel="manifest" href={`/manifest.json?v=${faviconVersion}`} />

        {telemetryConfig.enableGa && telemetryConfig.gaId && (
          <link rel="preconnect" href="https://www.googletagmanager.com" crossOrigin="" />
        )}

        {/* Structured Data - Person + Organization Schema for SEO
             All values are static string literals from siteConfig — no user input, safe for JSON.stringify. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(getSiteStructuredData()),
          }}
        />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
        <meta name="apple-mobile-web-app-title" content={siteConfig.shortName} />
        
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
        suppressHydrationWarning
        className={`${GeistMono.className} ${GeistMono.variable} ${GeistPixelSquare.variable} safe-area-padding text-foreground`}
        style={{
          backgroundColor: 'var(--background)',
        }}
      >
        <MotionProvider>
          <SoundProvider>
            <HoverSoundCue />
            <TopMeta />
            <SmoothScroll>
              <a
                href="#main-content"
                className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-card focus:px-3 focus:py-2 focus:text-foreground"
              >
                Skip to content
              </a>
              <div className="min-h-screen flex flex-col">
                <main id="main-content" role="main" className="flex-1 pt-14 sm:pt-16">
                  <PageTransition>{children}</PageTransition>
                </main>
                <Footer />
              </div>
              {telemetryConfig.enableSpeedInsights && (
                <SpeedInsights
                  sampleRate={1}
                />
              )}
              {telemetryConfig.enableVercelAnalytics && <Analytics mode="production" />}
              {process.env.NODE_ENV === 'development' && process.env.NEXT_PUBLIC_ENABLE_PERF_MONITOR === 'true' && <PerformanceMonitor />}
              {process.env.NODE_ENV === 'development' && <Agentation />}
              {process.env.NODE_ENV === 'development' && (
                <Script id="sw-dev-reset" strategy="afterInteractive">
                  {`
                    if ('serviceWorker' in navigator) {
                      navigator.serviceWorker.getRegistrations()
                        .then(function(registrations) {
                          return Promise.all(registrations.map(function(registration) {
                            return registration.unregister();
                          }));
                        })
                        .catch(function() {});
                    }

                    if ('caches' in window) {
                      caches.keys()
                        .then(function(cacheNames) {
                          return Promise.all(cacheNames.map(function(cacheName) {
                            return caches.delete(cacheName);
                          }));
                        })
                        .catch(function() {});
                    }
                  `}
                </Script>
              )}

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
            <JoyfulLayer projects={launcherProjects} />
            <ScrollToTop />
            <ProgressiveBlur />
          </SoundProvider>
        </MotionProvider>
      </body>
    </html>
  )
}
