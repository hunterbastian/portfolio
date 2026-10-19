import { Inter } from 'next/font/google'
import PlaygroundShowcase from '@/components/playground/PlaygroundShowcase'
import { sortProjectsForPlayground } from '@/lib/playground'
import { getArchivedProjects } from '@/lib/projects'
import { siteConfig } from '@/lib/site'
import { getStaticPageMetadata } from '@/lib/site-metadata'

const showcaseFont = Inter({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
})

const playgroundDescription = `Experiments and side projects by ${siteConfig.personName}.`

export const metadata = getStaticPageMetadata({
  absoluteTitle: true,
  description: playgroundDescription,
  image: '/playground/opengraph-image',
  imageAlt: `Playground — ${siteConfig.personName}`,
  openGraphType: 'website',
  path: '/playground',
  siteName: siteConfig.personName,
  title: 'Playground',
})

export default function PlaygroundPage() {
  const projects = sortProjectsForPlayground(getArchivedProjects()).map((project) => ({
    ...project,
    content: '',
  }))

  return <PlaygroundShowcase className={showcaseFont.className} projects={projects} />
}
