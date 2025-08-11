import type { Metadata } from 'next'
import { JetBrains_Mono, Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/Header'
import Footer from '@/components/Footer'


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
  style: ['italic'],
  variable: '--font-playfair'
})

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
      <body className={`${jetbrainsMono.className} ${inter.variable} ${playfairDisplay.variable}`}>
                       <div className="min-h-screen flex flex-col">
                 <Header />
                 <main className="flex-1">{children}</main>
                 <Footer />
               </div>
      </body>
    </html>
  )
}
