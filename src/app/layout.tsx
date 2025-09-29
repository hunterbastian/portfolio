import type { Metadata } from 'next'
import { JetBrains_Mono, Inter, EB_Garamond } from 'next/font/google'
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
  weight: ['500', '700'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
  preload: true,
  adjustFontFallback: true, // Better font fallback
})

// Import PP Editorial New from local files or use a similar Google Font alternative
// Using Playfair Display for elegant headings
import { Playfair_Display } from 'next/font/google'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['italic', 'normal'],
  weight: ['400', '600'],
  variable: '--font-playfair',
  display: 'swap',
  preload: true,
  adjustFontFallback: true,
})

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  viewportFit: 'cover'
}

export const metadata: Metadata = {
  title: 'Hunter Bastian - Portfolio',
  description: 'Full-stack developer and designer passionate about creating exceptional digital experiences.',
  keywords: ['Hunter Bastian', 'developer', 'designer', 'portfolio', 'full-stack', 'React', 'Next.js'],
  authors: [{ name: 'Hunter Bastian' }],
  creator: 'Hunter Bastian',
  metadataBase: new URL('https://portfolio-hunterbastians-projects.vercel.app'),

  icons: {
    icon: [
      { url: '/favicon/Frame.svg', type: 'image/svg+xml' },
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico', sizes: 'any' }
    ],
    apple: [
      { url: '/favicon/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }
    ],
    other: [
      { url: '/favicon/favicon-192x192.png', sizes: '192x192', type: 'image/png' },
      { url: '/favicon/favicon-512x512.png', sizes: '512x512', type: 'image/png' }
    ]
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    title: 'Hunter Bastian - Portfolio',
    description: 'Full-stack developer and designer passionate about creating exceptional digital experiences.',
    siteName: 'Hunter Bastian Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Hunter Bastian - Portfolio',
    description: 'Full-stack developer and designer passionate about creating exceptional digital experiences.',
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
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="HB Portfolio" />
        
        {/* Resource Hints - Optimized for performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" crossOrigin="" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link rel="dns-prefetch" href="//vitals.vercel-analytics.com" />
        <link rel="dns-prefetch" href="//analytics.vercel.com" />
      </head>
                   <body className={`${jetbrainsMono.className} ${playfairDisplay.variable} safe-area-padding bg-background text-foreground`}>
                       <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-50 focus:bg-white focus:text-black focus:px-3 focus:py-2 focus:rounded">Skip to content</a>
                       <div className="min-h-screen flex flex-col">
                 <Header />
                 <main id="main-content" role="main" className="flex-1">{children}</main>
                 <Footer />
                               </div>
                <SpeedInsights />
                <Analytics />
                {process.env.NODE_ENV === 'development' && <PerformanceMonitor />}
                
                {/* Service Worker Registration - DISABLED FOR DEVELOPMENT */}
                {process.env.NODE_ENV === 'production' && (
                  <Script id="sw-registration" strategy="afterInteractive">
                    {`
                      if ('serviceWorker' in navigator) {
                        window.addEventListener('load', function() {
                          navigator.serviceWorker.register('/sw.js')
                            .then(function(registration) {
                              console.log('SW registered: ', registration);
                            })
                            .catch(function(registrationError) {
                              console.log('SW registration failed: ', registrationError);
                            });
                        });
                      }
                    `}
                  </Script>
                )}
              </body>
            </html>
          )
        }
