export const ALLOWED_REVALIDATE_PATHS = [
  '/',
  '/about',
  '/archive',
  '/cv',
  '/logo',
  '/opengraph-image',
  '/robots.txt',
  '/sitemap.xml',
] as const

const PROJECT_REVALIDATE_PATH_PATTERN = /^\/projects\/[a-z0-9-]+(?:\/opengraph-image)?$/

export function normalizeRevalidatePath(path: string | null | undefined): string {
  return path?.trim() ?? ''
}

export function isAllowedRevalidatePath(path: string): boolean {
  return ALLOWED_REVALIDATE_PATHS.includes(path as (typeof ALLOWED_REVALIDATE_PATHS)[number])
    || PROJECT_REVALIDATE_PATH_PATTERN.test(path)
}
