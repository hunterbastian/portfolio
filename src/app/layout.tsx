import type { Metadata } from 'next'
import { Inter, JetBrains_Mono, Playfair_Display, Source_Code_Pro } from 'next/font/google'
import './globals.css'
import './viewport.css'
import 'dialkit/styles.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import PerformanceMonitor from '@/components/PerformanceMonitor'
import PageTransition from '@/components/PageTransition'
import DialKitRoot from '@/components/DialKitRoot'
import ThemeSurfaceDial from '@/components/ThemeSurfaceDial'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'

// Primary body font
const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['500'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
  fallback: ['ui-monospace', 'monospace'],
})

// Display serif
const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['italic'],
  weight: ['600'],
  variable: '--font-playfair',
  display: 'swap',
  preload: false,
  fallback: ['Georgia', 'serif'],
})

// UI labels (minimal code aesthetic)
const sourceCodePro = Source_Code_Pro({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-source-code-pro',
  display: 'swap',
  preload: false,
  fallback: ['ui-monospace', 'monospace'],
})

// Section headings and UI sans
const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
  preload: false,
  fallback: ['system-ui', 'sans-serif'],
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
        <meta name="theme-color" content="#2e3440" />
        
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
        <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="//analytics.vercel.com" />
        
        {/* Critical CSS - Inline for faster FCP */}
        <style dangerouslySetInnerHTML={{
          __html: `
            /* Critical above-the-fold styles */
            body { margin: 0; font-family: ui-monospace, monospace; }
            .hero-section { min-height: 0; }
            .hero-section h1 { line-height: 1.2; }
          `
        }} />
        
        {/* Text selection highlight - Aqua */}
        <style dangerouslySetInnerHTML={{
          __html: `
            ::selection {
              background-color: rgba(94, 129, 172, var(--theme-selection-opacity)) !important;
              color: inherit !important;
            }
            ::-moz-selection {
              background-color: rgba(94, 129, 172, var(--theme-selection-opacity)) !important;
              color: inherit !important;
            }
            ::-webkit-selection {
              background-color: rgba(94, 129, 172, var(--theme-selection-opacity)) !important;
              color: inherit !important;
            }
          `
        }} />
      </head>
                   <body className={`${jetbrainsMono.className} ${playfairDisplay.variable} ${sourceCodePro.variable} ${inter.variable} safe-area-padding bg-background text-foreground`}>
                       <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
                       <div className="min-h-screen flex flex-col">
                 <Header />
                 <main id="main-content" role="main" className="flex-1">
                   <PageTransition>{children}</PageTransition>
                 </main>
                 <Footer />
                               </div>
                <SpeedInsights 
                  sampleRate={1}
                />
                <Analytics 
                  mode={process.env.NODE_ENV === 'production' ? 'production' : 'development'}
                />
                <DialKitRoot />
                <ThemeSurfaceDial />
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
