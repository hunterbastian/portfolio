import { siteConfig } from './site.ts'

interface SiteStructuredDataConfig {
  personName: string
  siteDescription: string
  studioName: string
  url: string
}

export const SITE_PERSON_SAME_AS = [
  'https://github.com/hunterbastian',
  'https://linkedin.com/in/hunterbastian',
  'https://x.com/thestudioalpine',
  'https://instagram.com/studio.alpine',
  'https://threads.net/@studio.alpine',
  'https://youtube.com/@studio.alpine',
] as const

export const SITE_PERSON_KNOWS_ABOUT = [
  'Interaction Design',
  'UI Design',
  'UX Design',
  'Web Development',
  'Frontend Development',
  'React',
  'Next.js',
  'TypeScript',
  'Three.js',
  'Framer Motion',
  'Photography',
  'Creative Coding',
] as const

export function getSiteStructuredData(config: SiteStructuredDataConfig = siteConfig) {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Person',
        '@id': `${config.url}/#person`,
        name: config.personName,
        url: config.url,
        jobTitle: 'Design Engineer',
        description: config.siteDescription,
        sameAs: SITE_PERSON_SAME_AS,
        knowsAbout: SITE_PERSON_KNOWS_ABOUT,
      },
      {
        '@type': 'Organization',
        '@id': `${config.url}/#organization`,
        name: config.studioName,
        url: 'https://instagram.com/studio.alpine',
        logo: `${config.url}/images/optimized/studio-alpine-logo.webp`,
        description: `Photography and design studio founded by ${config.personName}.`,
        founder: { '@id': `${config.url}/#person` },
        foundingDate: '2026',
        sameAs: [
          'https://instagram.com/studio.alpine',
          'https://youtube.com/@studio.alpine',
        ],
      },
    ],
  }
}
