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

/** Home and the project index share the dark Cards shell. */
export function isCardsPortfolioPath(pathname: string): boolean {
  const path = normalizeAppPathname(pathname).replace(/\/+$/, '') || '/'
  return path === '/' || path === '/projects'
}

export type DocumentShell =
  | { kind: 'cards' }
  | { kind: 'showcase'; extra: 'playgroundShowcase' | 'cvShowcase' | 'notFoundShowcase' }
  | { kind: 'default' }

/**
 * Matches the root boot script so a client-side navigation can put the same
 * attribute back, or take the Cards attribute off when leaving `/` and `/projects`.
 */
export function getDocumentShell(pathname: string): DocumentShell {
  const path = normalizeAppPathname(pathname).replace(/\/+$/, '') || '/'
  if (isCardsPortfolioPath(path)) return { kind: 'cards' }
  if (path === '/playground') return { kind: 'showcase', extra: 'playgroundShowcase' }
  if (path === '/cv') return { kind: 'showcase', extra: 'cvShowcase' }

  const known =
    path === '/about' ||
    path === '/archive' ||
    path === '/logo' ||
    path.startsWith('/projects/') ||
    path.startsWith('/tools/')

  if (!known) return { kind: 'showcase', extra: 'notFoundShowcase' }
  return { kind: 'default' }
}
