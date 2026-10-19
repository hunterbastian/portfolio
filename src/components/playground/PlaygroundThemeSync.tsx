'use client'

import { useLayoutEffect } from 'react'
import {
  HOME_SHOWCASE_CANVAS,
  HOME_SHOWCASE_THEME_STORAGE_KEY,
  parseShowcaseThemePreference,
  resolveShowcaseTheme,
} from '@/lib/home-showcase'
import { siteConfig } from '@/lib/site'

function readPlaygroundTheme() {
  let stored: string | null = null
  try {
    stored = localStorage.getItem(HOME_SHOWCASE_THEME_STORAGE_KEY)
  } catch {
    stored = null
  }

  return resolveShowcaseTheme(
    parseShowcaseThemePreference(stored),
    window.matchMedia('(prefers-color-scheme: dark)').matches,
  )
}

function applyPlaygroundTheme(theme: 'light' | 'dark') {
  document.documentElement.dataset.playgroundTheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute(
    'content',
    theme === 'dark' ? siteConfig.themeColorDark : HOME_SHOWCASE_CANVAS,
  )
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', theme)
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute(
    'content',
    theme === 'dark' ? 'black' : 'default',
  )
}

function clearPlaygroundTheme() {
  delete document.documentElement.dataset.playgroundTheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', siteConfig.themeColorDark)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark')
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', 'black')
}

/** Follows the homepage light/dark choice, then the system scheme, before paint. */
export default function PlaygroundThemeSync() {
  useLayoutEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const apply = () => applyPlaygroundTheme(readPlaygroundTheme())

    apply()
    media.addEventListener('change', apply)
    return () => {
      media.removeEventListener('change', apply)
      clearPlaygroundTheme()
    }
  }, [])

  return null
}
