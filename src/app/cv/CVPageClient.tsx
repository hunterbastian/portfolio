'use client'

import { Fragment, useCallback, useEffect, useLayoutEffect, useState } from 'react'
import Link from 'next/link'
import { educationItems, experienceItems } from '@/content/homepage'
import {
  HOME_SHOWCASE_ROLE,
  HOME_SHOWCASE_THEME_STORAGE_KEY,
  getShowcaseChrome,
  parseShowcaseThemePreference,
  resolveShowcaseTheme,
  type ShowcaseTheme,
} from '@/lib/home-showcase'
import { siteConfig } from '@/lib/site'
import { analytics } from '@/lib/analytics'
import {
  CV_CONTACT_LINKS,
  CV_LOCATION_LABEL,
  CV_PRINT_ARIA_LABEL,
  CV_PRINT_BUTTON_LABEL,
  CV_RESUME_VIEW_ACTION,
  activateCvContactClick,
  activateCvPrint,
  formatCvEducationDetail,
  getCvEntryDate,
  getCvEntryDetail,
  type CvContactLink,
} from '@/lib/cv-page'

interface CvShowcaseProps {
  className?: string
}

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

function applyCvShowcaseTheme(theme: ShowcaseTheme) {
  const chrome = getShowcaseChrome(theme === 'dark')
  const root = document.documentElement
  root.dataset.homeShowcase = 'true'
  root.dataset.cvShowcase = 'true'
  root.dataset.homeShowcaseTheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', chrome.canvas)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', chrome.colorScheme)
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', chrome.statusBar)
}

function clearCvShowcaseTheme() {
  const root = document.documentElement
  delete root.dataset.homeShowcase
  delete root.dataset.cvShowcase
  delete root.dataset.homeShowcaseTheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', siteConfig.themeColorDark)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark')
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', 'black')
}

function trackCvContactClick(link: CvContactLink) {
  activateCvContactClick({
    link,
    trackExternalLink: (href, platform) => analytics.externalLink(href, platform),
    trackNavigationClick: (target) => analytics.navigationClick(target),
  })
}

export default function CVPageClient({ className }: CvShowcaseProps) {
  const [theme, setTheme] = useState<ShowcaseTheme>('light')

  const chooseTheme = useCallback((next: ShowcaseTheme) => {
    writeShowcaseThemePreference(next)
    applyCvShowcaseTheme(next)
    setTheme(next)
  }, [])

  useLayoutEffect(() => {
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const next = resolveShowcaseTheme(readShowcaseThemePreference(), scheme.matches)
      applyCvShowcaseTheme(next)
      setTheme(next)
    }

    sync()
    scheme.addEventListener('change', sync)
    return () => {
      scheme.removeEventListener('change', sync)
      clearCvShowcaseTheme()
    }
  }, [])

  useEffect(() => {
    analytics.resumeAction(CV_RESUME_VIEW_ACTION)
  }, [])

  return (
    <div className={className ? `cv-showcase ${className}` : 'cv-showcase'}>
      <div className="cv-showcase-sheet">
        <header className="cv-showcase-bar">
          <h1>
            <Link href="/">{siteConfig.personName}</Link>
          </h1>
          <div className="cv-showcase-tools">
            <Link href="/">Back</Link>
            <button
              type="button"
              className="cv-showcase-print"
              aria-label={CV_PRINT_ARIA_LABEL}
              onClick={() => {
                activateCvPrint({
                  printPage: () => window.print(),
                  trackResumeAction: (action) => analytics.resumeAction(action),
                })
              }}
            >
              {CV_PRINT_BUTTON_LABEL}
            </button>
            <div className="cv-showcase-theme" role="group" aria-label="Color theme">
              <button type="button" aria-pressed={theme === 'light'} onClick={() => chooseTheme('light')}>
                Light
              </button>
              <span aria-hidden="true">/</span>
              <button type="button" aria-pressed={theme === 'dark'} onClick={() => chooseTheme('dark')}>
                Dark
              </button>
            </div>
          </div>
        </header>

        <p className="cv-showcase-role">{HOME_SHOWCASE_ROLE}</p>
        <p className="cv-showcase-contact">
          <span>{CV_LOCATION_LABEL}</span>
          {CV_CONTACT_LINKS.map((link) => (
            <Fragment key={link.href}>
              <span className="cv-showcase-dot" aria-hidden="true">·</span>
              <a href={link.href} onClick={() => trackCvContactClick(link)}>
                {link.label}
              </a>
            </Fragment>
          ))}
        </p>

        <section className="cv-showcase-section" aria-labelledby="cv-experience">
          <h2 id="cv-experience">Experience</h2>
          {experienceItems.map((item) => {
            const date = getCvEntryDate(item.year)
            const detail = getCvEntryDetail(item.description)
            return (
              <article key={`${item.company}-${item.title}`} className="cv-showcase-entry">
                <div className="cv-showcase-line">
                  <p className="cv-showcase-title">{item.company} · {item.title}</p>
                  {date ? <p className="cv-showcase-dates">{date}</p> : null}
                </div>
                {detail ? <p className="cv-showcase-detail">{detail}</p> : null}
              </article>
            )
          })}
        </section>

        <section className="cv-showcase-section" aria-labelledby="cv-education">
          <h2 id="cv-education">Education</h2>
          {educationItems.map((item) => {
            const date = getCvEntryDate(item.year)
            return (
              <article key={`${item.institution}-${item.degree}-${item.year}`} className="cv-showcase-entry">
                <div className="cv-showcase-line">
                  <p className="cv-showcase-title">{item.institution} · {item.degree}</p>
                  {date ? <p className="cv-showcase-dates">{date}</p> : null}
                </div>
                <p className="cv-showcase-detail">{formatCvEducationDetail(item)}</p>
              </article>
            )
          })}
        </section>
      </div>
    </div>
  )
}
