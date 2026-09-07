export const siteConfig = {
  url: 'https://hunterbastian.com',
  personName: 'Hunter Bastian',
  // Separate brands: Alpine is photography/creator work; Cala is the design business.
  studioName: 'Studio Alpine',
  designStudioName: 'Studio Cala',
  designStudioUrl: 'https://studio-cala.vercel.app/',
  brandName: 'Hunter Bastian',
  appName: 'Hunter Bastian Portfolio',
  shortName: 'HB Portfolio',
  siteTitle: 'Hunter Bastian - Design Engineer',
  siteDescription: 'Design engineer building digital products with motion, craft, and detail. Interaction design student at UVU, based in Utah.',
  defaultOgImage: '/images/profilepicture.webp',
  siteCoordinates: '40.7608° N / 111.8910° W',
  siteLocation: 'LEHI UT',
  siteSeason: 'SPRING / 2026',
  faviconVersion: '20260506a',
  themeColorLight: '#191815',
  themeColorDark: '#191815',
  email: 'hunterbastianux@gmail.com',
  inquirySubject: 'Project Inquiry',
} as const

export const sitePortfolioName = siteConfig.appName
export const siteMailtoHref = `mailto:${siteConfig.email}`
export const siteProjectInquiryHref = `${siteMailtoHref}?subject=${encodeURIComponent(siteConfig.inquirySubject)}`

export function resolveSiteUrl(path = ''): string {
  return new URL(path, siteConfig.url).toString()
}
