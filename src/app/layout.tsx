import type { Metadata } from 'next'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { SpeedInsights } from '@vercel/speed-insights/next'

export const metadata: Metadata = {
  title: 'Hunter Bastian - Portfolio',
  description: 'Full-stack developer and designer passionate about creating exceptional digital experiences.',
  keywords: ['Hunter Bastian', 'developer', 'designer', 'portfolio', 'full-stack', 'React', 'Next.js'],
  authors: [{ name: 'Hunter Bastian' }],
  creator: 'Hunter Bastian',
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
      <body className="font-mono">
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
        <SpeedInsights />
      </body>
    </html>
  )
}
