'use client'

import { useEffect } from 'react'
import { usePathname } from 'next/navigation'

import { CARDS_CANVAS } from '@/lib/cards-portfolio'
import { HOME_SHOWCASE_CANVAS } from '@/lib/home-showcase'
import { getDocumentShell, normalizeAppPathname } from '@/lib/pathname'

const SHOWCASE_EXTRAS = ['playgroundShowcase', 'cvShowcase', 'notFoundShowcase'] as const

function setMeta(name: string, content: string) {
  document.querySelector(`meta[name="${name}"]`)?.setAttribute('content', content)
}

/** Keeps the Cards document attribute in step with the route after client navigations. */
export default function DocumentShell() {
  const pathname = normalizeAppPathname(usePathname() || '/')

  useEffect(() => {
    const root = document.documentElement
    const shell = getDocumentShell(pathname)

    delete root.dataset.cardsPortfolio
    delete root.dataset.homeShowcase
    for (const key of SHOWCASE_EXTRAS) delete root.dataset[key]

    if (shell.kind === 'cards') {
      root.dataset.cardsPortfolio = 'true'
      setMeta('theme-color', CARDS_CANVAS)
      setMeta('color-scheme', 'dark')
      setMeta('apple-mobile-web-app-status-bar-style', 'black-translucent')
      return
    }

    if (shell.kind === 'showcase') {
      root.dataset.homeShowcase = 'true'
      root.dataset[shell.extra] = 'true'
    }

    setMeta('theme-color', HOME_SHOWCASE_CANVAS)
    setMeta('color-scheme', 'light')
    setMeta('apple-mobile-web-app-status-bar-style', 'default')
  }, [pathname])

  return null
}
