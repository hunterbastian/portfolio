import type { Metadata } from 'next'
import { JetBrains_Mono, Inter, EB_Garamond } from 'next/font/google'
import './globals.css'
import './viewport.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Analytics } from '@vercel/analytics/react'
import Script from 'next/script'


const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-jetbrains-mono'
})

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter'
})

// Import PP Editorial New from local files or use a similar Google Font alternative
// Since PP Editorial New isn't available on Google Fonts, we'll use Playfair Display Italic as a substitute
import { Playfair_Display } from 'next/font/google'

const playfairDisplay = Playfair_Display({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-playfair'
})

const ebGaramond = EB_Garamond({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-garamond'
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

  icons: {
    icon: [
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
                   <body className={`${jetbrainsMono.className} ${inter.variable} ${playfairDisplay.variable} ${ebGaramond.variable} safe-area-padding`}>
                       <div className="min-h-screen flex flex-col">
                 <Header />
                 <main className="flex-1">{children}</main>
                 <Footer />
                               </div>
                <SpeedInsights />
                <Analytics />
                
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
