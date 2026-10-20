/**
 * Next renders the app index as `/index` during SSR. The browser pathname is `/`.
 * Treat those as the same path so server HTML and the client tree match.
 */
export function normalizeAppPathname(pathname: string): string {
  return pathname === '/index' ? '/' : pathname
}

export function isHomePathname(pathname: string): boolean {
  return normalizeAppPathname(pathname) === '/'
}
