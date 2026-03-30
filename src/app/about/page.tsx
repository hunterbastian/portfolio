import type { Metadata } from 'next'
import AboutPageClient from './AboutPageClient'

export const metadata: Metadata = {
  title: 'About - Hunter Bastian',
  description: 'A little about Hunter Bastian — design engineer, photographer, and student based in Utah.',
}

export default function AboutPage() {
  return <AboutPageClient />
}
