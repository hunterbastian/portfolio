import type { Metadata } from 'next'
import { JetBrains_Mono } from 'next/font/google'
import './globals.css'
import './viewport.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'


// Optimized: Reduced to 2 primary fonts for better performance
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
})

// Using Playfair Display for elegant headings
import { Playfair_Display } from 'next/font/google'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['600'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  fallback: ['Georgia', 'serif'],
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover'
}

const faviconVersion = '20260207'

export const metadata: Metadata = {
  title: 'Hunter Bastian - Portfolio',
  description: 'Student Product Designer and Photographer',
  keywords: ['Hunter Bastian', 'developer', 'designer', 'portfolio', 'full-stack', 'React', 'Next.js'],
  authors: [{ name: 'Hunter Bastian' }],
  creator: 'Hunter Bastian',
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
    title: 'Hunter Bastian - Portfolio',
    description: 'Student Product Designer and Photographer',
    siteName: 'Hunter Bastian Portfolio',
    images: [
      {
        url: '/images/social/profile-preview.jpg',
        width: 1200,
        height: 630,
        alt: 'Hunter Bastian - Designer & Developer Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hunter Bastian - Portfolio',
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
        <meta name="theme-color" content="#000000" />
        
        {/* Structured Data - Person Schema for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Person',
              name: 'Hunter Bastian',
              url: 'https://hunterbastian.com',
              jobTitle: 'Full-Stack Developer & Designer',
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
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="//analytics.vercel.com" />
        <link rel="dns-prefetch" href="//app.endlesstools.io" />
        
        {/* Critical CSS - Inline for faster FCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { margin: 0; font-family: ui-monospace, monospace; }
            .hero-section { min-height: 60vh; }
            h1 { font-size: clamp(2rem, 5vw, 4rem); line-height: 1.2; }
          `
        }} />
        
        {/* Text selection highlight - Aqua */}
        <style dangerouslySetInnerHTML={{
          __html: `
            ::selection {
              background-color: rgba(0, 255, 255, 0.3) !important;
              color: inherit !important;
            }
            ::-moz-selection {
              background-color: rgba(0, 255, 255, 0.3) !important;
              color: inherit !important;
            }
            ::-webkit-selection {
              background-color: rgba(0, 255, 255, 0.3) !important;
              color: inherit !important;
            }
          `
        }} />
      </head>
                   <body className={`${jetbrainsMono.className} ${playfairDisplay.variable} safe-area-padding bg-background text-foreground`}>
                       <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
                       <div className="min-h-screen flex flex-col">
                 <Header />
                 <main id="main-content" role="main" className="flex-1">{children}</main>
                 <Footer />
                               </div>
                <SpeedInsights 
                  sampleRate={1}
                />
                <Analytics 
                  mode={process.env.NODE_ENV === 'production' ? 'production' : 'development'}
                />
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
              </body>
            </html>
          )
        }
