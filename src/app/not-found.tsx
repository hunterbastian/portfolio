'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useCallback, useEffect, useLayoutEffect, useState } from 'react'
import ShowcaseThemeSwitch from '@/components/showcase/ShowcaseThemeSwitch'
import {
  HOME_SHOWCASE_THEME_STORAGE_KEY,
  getShowcaseChrome,
  parseShowcaseThemePreference,
  resolveShowcaseTheme,
  type ShowcaseTheme,
} from '@/lib/home-showcase'
import {
  NOT_FOUND_DESCRIPTION,
  NOT_FOUND_HEADING,
  NOT_FOUND_HOME_ARROW,
  NOT_FOUND_HOME_HREF,
  NOT_FOUND_HOME_LABEL,
} from '@/lib/not-found'
import { siteConfig } from '@/lib/site'

const showcaseFont = Inter({
  subsets: ['latin'],
  weight: '500',
  display: 'swap',
  fallback: ['Helvetica Neue', 'Arial', 'sans-serif'],
  adjustFontFallback: false,
})

function readShowcaseThemePreference() {
  try {
    return parseShowcaseThemePreference(localStorage.getItem(HOME_SHOWCASE_THEME_STORAGE_KEY))
  } catch {
    return 'system' as const
  }
}

function writeShowcaseThemePreference(theme: ShowcaseTheme) {
  try {
    localStorage.setItem(HOME_SHOWCASE_THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing can reject storage. The choice still applies for this view.
  }
}

function applyNotFoundTheme(theme: ShowcaseTheme) {
  const chrome = getShowcaseChrome(theme === 'dark')
  const root = document.documentElement
  root.dataset.homeShowcase = 'true'
  root.dataset.notFoundShowcase = 'true'
  root.dataset.homeShowcaseTheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', chrome.canvas)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', chrome.colorScheme)
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', chrome.statusBar)
}

function clearNotFoundTheme() {
  const root = document.documentElement
  delete root.dataset.homeShowcase
  delete root.dataset.notFoundShowcase
  delete root.dataset.homeShowcaseTheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', siteConfig.themeColorDark)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark')
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', 'black')
}

export default function NotFound() {
  const [theme, setTheme] = useState<ShowcaseTheme>('light')

  const chooseTheme = useCallback((next: ShowcaseTheme) => {
    writeShowcaseThemePreference(next)
    applyNotFoundTheme(next)
    setTheme(next)
  }, [])

  useLayoutEffect(() => {
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const next = resolveShowcaseTheme(readShowcaseThemePreference(), scheme.matches)
      applyNotFoundTheme(next)
      setTheme(next)
    }

    sync()
    scheme.addEventListener('change', sync)
    return () => {
      scheme.removeEventListener('change', sync)
      clearNotFoundTheme()
    }
  }, [])

  useEffect(() => {
    const previous = document.title
    document.title = `${NOT_FOUND_HEADING} | ${siteConfig.personName}`
    return () => {
      document.title = previous
    }
  }, [])

  return (
    <div className={showcaseFont.className ? `not-found-showcase ${showcaseFont.className}` : 'not-found-showcase'}>
      <div className="not-found-showcase-bar">
        <ShowcaseThemeSwitch className="not-found-showcase-theme" theme={theme} onChange={chooseTheme} />
      </div>
      <div className="not-found-showcase-copy">
        <h1>{NOT_FOUND_HEADING}</h1>
        <p>{NOT_FOUND_DESCRIPTION}</p>
        <Link href={NOT_FOUND_HOME_HREF}>
          {NOT_FOUND_HOME_LABEL}
          <span className="home-showcase-arrow" aria-hidden="true">{NOT_FOUND_HOME_ARROW}</span>
        </Link>
      </div>
    </div>
  )
}
