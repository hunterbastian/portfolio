export const siteConfig = {
  url: 'https://hunterbastian.com',
  brandName: 'Hunter Bastian // Studio Alpine',
  siteTitle: 'Hunter Bastian - Portfolio',
  siteDescription: 'Design Engineer and Photographer',
  siteCoordinates: '40.7608° N / 111.8910° W',
  siteLocation: 'LEHI UT',
  siteSeason: 'SPRING / 2026',
  email: 'hello@hunterbastian.com',
  inquirySubject: 'Project Inquiry',
} as const

export const sitePortfolioName = `${siteConfig.brandName} Portfolio`
export const siteMailtoHref = `mailto:${siteConfig.email}`
export const siteProjectInquiryHref = `${siteMailtoHref}?subject=${encodeURIComponent(siteConfig.inquirySubject)}`

export function resolveSiteUrl(path = ''): string {
  return new URL(path, siteConfig.url).toString()
}
