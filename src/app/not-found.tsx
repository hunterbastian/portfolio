'use client'

import { Inter } from 'next/font/google'
import Link from 'next/link'
import { useEffect, useLayoutEffect } from 'react'
import {
  HOME_SHOWCASE_THEME_STORAGE_KEY,
  getShowcaseChrome,
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

function applyNotFoundChrome() {
  const chrome = getShowcaseChrome()
  const root = document.documentElement
  root.dataset.homeShowcase = 'true'
  root.dataset.notFoundShowcase = 'true'
  delete root.dataset.homeShowcaseTheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', chrome.canvas)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', chrome.colorScheme)
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', chrome.statusBar)
  try {
    localStorage.removeItem(HOME_SHOWCASE_THEME_STORAGE_KEY)
  } catch {
    // Private browsing can reject storage. The page still stays light.
  }
}

function clearNotFoundChrome() {
  const root = document.documentElement
  delete root.dataset.homeShowcase
  delete root.dataset.notFoundShowcase
  delete root.dataset.homeShowcaseTheme
}

export default function NotFound() {
  useLayoutEffect(() => {
    applyNotFoundChrome()
    return () => {
      clearNotFoundChrome()
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
