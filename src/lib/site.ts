export const siteConfig = {
  url: 'https://hunterbastian.com',
  personName: 'Hunter Bastian',
  studioName: 'Studio Alpine',
  brandName: 'Hunter Bastian',
  appName: 'Hunter Bastian Portfolio',
  shortName: 'HB Portfolio',
  siteTitle: 'Hunter Bastian — Interaction designer in Lehi, Utah',
  siteDescription:
    'I design and build digital products with calm interfaces, thoughtful motion, and visual restraint. Interaction Design student at Utah Valley University, based in Lehi, Utah.',
  defaultOgImage: '/images/profilepicture.webp',
  siteCoordinates: '40.7608° N / 111.8910° W',
  siteLocation: 'LEHI UT',
  siteSeason: 'SPRING / 2026',
  faviconVersion: '20260506a',
  themeColorLight: '#f2f1ef',
  themeColorDark: '#191919',
  email: 'hunterbastianux@gmail.com',
  inquirySubject: 'Project Inquiry',
} as const

export const sitePortfolioName = siteConfig.appName
export const siteMailtoHref = `mailto:${siteConfig.email}`
export const siteProjectInquiryHref = `${siteMailtoHref}?subject=${encodeURIComponent(siteConfig.inquirySubject)}`

export function resolveSiteUrl(path = ''): string {
  return new URL(path, siteConfig.url).toString()
}
