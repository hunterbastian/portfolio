import { Inter } from 'next/font/google'

/** Cards pages use Inter. The rest of the site keeps its existing faces. */
export const cardsFont = Inter({
  subsets: ['latin'],
  weight: ['400', '500'],
  display: 'swap',
  adjustFontFallback: false,
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
})
