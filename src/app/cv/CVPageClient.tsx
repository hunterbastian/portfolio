'use client'

import { Fragment, useEffect, useLayoutEffect } from 'react'
import Link from 'next/link'
import EmailCopyLink from '@/components/showcase/EmailCopyLink'
import { cvSelectedWork, cvTools, educationItems, experienceItems } from '@/content/homepage'
import {
  HOME_SHOWCASE_ROLE,
  HOME_SHOWCASE_THEME_STORAGE_KEY,
  getShowcaseChrome,
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

function applyCvShowcaseChrome() {
  const chrome = getShowcaseChrome()
  const root = document.documentElement
  root.dataset.homeShowcase = 'true'
  root.dataset.cvShowcase = 'true'
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

function clearCvShowcaseTheme() {
  const root = document.documentElement
  delete root.dataset.homeShowcase
  delete root.dataset.cvShowcase
  delete root.dataset.homeShowcaseTheme
}

function trackCvContactClick(link: CvContactLink) {
  activateCvContactClick({
    link,
    trackExternalLink: (href, platform) => analytics.externalLink(href, platform),
    trackNavigationClick: (target) => analytics.navigationClick(target),
  })
}

export default function CVPageClient({ className }: CvShowcaseProps) {
  useLayoutEffect(() => {
    applyCvShowcaseChrome()
    return () => {
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
          </div>
        </header>

        <p className="cv-showcase-role">{HOME_SHOWCASE_ROLE}</p>
        <p className="cv-showcase-contact">
          <span>{CV_LOCATION_LABEL}</span>
          {CV_CONTACT_LINKS.map((link) => (
            <Fragment key={link.href}>
              <span className="cv-showcase-dot" aria-hidden="true">·</span>
              {link.href.startsWith('mailto:') ? (
                <EmailCopyLink href={link.href} onClick={() => trackCvContactClick(link)}>
                  {link.label}
                </EmailCopyLink>
              ) : (
                <a href={link.href} onClick={() => trackCvContactClick(link)}>
                  {link.label}
                </a>
              )}
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

        <section className="cv-showcase-section" aria-labelledby="cv-selected-work">
          <h2 id="cv-selected-work">Selected work</h2>
          {cvSelectedWork.map((item) => (
            <article key={item.slug} className="cv-showcase-entry">
              <p className="cv-showcase-title">
                <Link href={`/projects/${item.slug}`}>{item.title} <span aria-hidden="true">{'↗︎'}</span></Link>
              </p>
              <p className="cv-showcase-detail">{item.summary}</p>
            </article>
          ))}
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

        <section className="cv-showcase-section" aria-labelledby="cv-tools">
          <h2 id="cv-tools">Tools</h2>
          <p className="cv-showcase-detail">{cvTools.join(' · ')}</p>
        </section>
      </div>
    </div>
  )
}
