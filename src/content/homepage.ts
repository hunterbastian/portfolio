import { siteProjectInquiryHref } from '@/lib/site'

export interface ExperienceItem {
  year: string
  company: string
  title: string
  description: string
}

export interface EducationItem {
  year: string
  institution: string
  degree: string
  level: string
  note?: string
}

export interface HomeLinkItem {
  label: string
  href: string
  external?: boolean
  ariaLabel?: string
  title?: string
  /** Identifier for a special icon/image to render alongside the label */
  iconType?: 'studio-alpine' | 'handshake'
}

export const homeHeroContent = {
  headline: 'Hunter Bastian',
  subtitle: 'Lehi, Utah',
  intro:
    'I design and build digital products with a focus on calm interfaces, thoughtful motion, and visual restraint. I am studying Interaction Design at Utah Valley University.',
  handwrittenNote: 'A little page on the internet all about me',
} as const

export const creatingLinks: HomeLinkItem[] = [
  {
    label: 'Studio Alpine',
    href: 'https://instagram.com/studio.alpine',
    external: true,
    ariaLabel: 'Photography Studio Studio Alpine',
    title: 'Photography Studio Studio Alpine',
    iconType: 'studio-alpine',
  },
  {
    label: 'Available for freelance',
    href: siteProjectInquiryHref,
    ariaLabel: 'Available for freelance',
    title: 'Available for freelance',
    iconType: 'handshake',
  },
]

export const contactSocialLinks: HomeLinkItem[] = [
  { label: 'Email', href: 'mailto:hunterbastianux@gmail.com', external: true },
  { label: 'LinkedIn', href: 'https://linkedin.com/in/hunterbastian', external: true },
  { label: 'Instagram', href: 'https://instagram.com/studio.alpine', external: true },
  { label: 'Threads', href: 'https://threads.net/@studio.alpine', external: true },
  { label: 'X', href: 'https://x.com/thestudioalpine', external: true },
  { label: 'GitHub', href: 'https://github.com/hunterbastian', external: true },
  { label: 'YouTube', href: 'https://youtube.com/@studio.alpine', external: true },
  { label: 'Are.na', href: 'https://www.are.na/hunter-bastian/channels', external: true },
]

export const experienceItems: ExperienceItem[] = [
  {
    year: '2026 - Present',
    company: 'Studio Alpine',
    title: 'Founder',
    description: 'Founder of Studio Alpine, a photography and design project.',
  },
  {
    year: '2024 - Present',
    company: 'Catapult',
    title: 'Video Producer',
    description: 'Produced and edited marketing and product videos for Catapult.',
  },
  {
    year: '2024 - Present',
    company: 'Utah Valley University',
    title: 'Department Representative',
    description: 'Helped new students with internship opportunities in the Web Design and Development program.',
  },
  {
    year: '2023',
    company: 'Nutricost',
    title: 'Graphic Design Intern',
    description:
      'At Nutricost, I assisted the marketing team and strengthened my knowledge as I worked in the graphic design queue.',
  },
  {
    year: '2017',
    company: 'Clutch',
    title: 'Digital Design Intern',
    description:
      'At Clutch, I helped with design branding and further improved my knowledge about the UX design process.',
  },
]

export const educationItems: EducationItem[] = [
  {
    year: '2023 - 2027',
    institution: 'Utah Valley University',
    degree: 'Interaction Design',
    level: "Bachelor's Degree",
  },
  {
    year: '2021',
    institution: 'Columbus State Community College',
    degree: 'Graphic Design',
    level: "Associate's Degree",
  },
  {
    year: '2021',
    institution: 'Google',
    degree: 'IT Support Professional Certificate',
    level: 'Issued in 2021',
  },
]
