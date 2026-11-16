'use client'

import { useEffect } from 'react'
import Link from 'next/link'
import EmailCopyLink from '@/components/showcase/EmailCopyLink'
import { cvSelectedWork, cvTools, educationItems, experienceItems } from '@/content/homepage'
import { HOME_SHOWCASE_ROLE } from '@/lib/home-showcase'
import { siteConfig } from '@/lib/site'
import { analytics } from '@/lib/analytics'
import {
  CV_CONTACT_LINKS,
  CV_DOWNLOAD_ARIA_LABEL,
  CV_DOWNLOAD_LABEL,
  CV_LOCATION_LABEL,
  CV_PRINT_ARIA_LABEL,
  CV_PRINT_BUTTON_LABEL,
  CV_RESUME_DOWNLOAD_ACTION,
  CV_RESUME_PDF_FILENAME,
  CV_RESUME_PDF_HREF,
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

function trackCvContactClick(link: CvContactLink) {
  activateCvContactClick({
    link,
    trackExternalLink: (href, platform) => analytics.externalLink(href, platform),
    trackNavigationClick: (target) => analytics.navigationClick(target),
  })
}

export default function CVPageClient({ className }: CvShowcaseProps) {
  useEffect(() => {
    analytics.resumeAction(CV_RESUME_VIEW_ACTION)
  }, [])

  return (
    <div className={className ? `cards-root cards-cv ${className}` : 'cards-root cards-cv'}>
      <div className="cards-frame-page cards-cv-page">
        <header className="cards-cv-bar">
          <div className="cards-identity">
            <h1 className="cards-name">
              <Link className="cards-name-link" href="/">
                {siteConfig.personName}
              </Link>
            </h1>
            <p className="cards-role">
              {HOME_SHOWCASE_ROLE}
              <span aria-hidden="true"> · </span>
              {CV_LOCATION_LABEL}
            </p>
          </div>
          <div className="cards-cv-actions">
            <a
              className="cards-cv-action"
              href={CV_RESUME_PDF_HREF}
              download={CV_RESUME_PDF_FILENAME}
              aria-label={CV_DOWNLOAD_ARIA_LABEL}
              onClick={() => analytics.resumeAction(CV_RESUME_DOWNLOAD_ACTION)}
            >
              {CV_DOWNLOAD_LABEL}
            </a>
            <button
              type="button"
              className="cards-cv-action"
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

        <p className="cards-cv-contact">
          {CV_CONTACT_LINKS.map((link) => (
            link.href.startsWith('mailto:') ? (
              <EmailCopyLink key={link.href} className="cards-cv-action" href={link.href} onClick={() => trackCvContactClick(link)}>
                {link.label}
              </EmailCopyLink>
            ) : (
              <a key={link.href} className="cards-cv-action" href={link.href} onClick={() => trackCvContactClick(link)}>
                {link.label}
              </a>
            )
          ))}
        </p>

        <section className="cards-cv-section" aria-labelledby="cv-experience">
          <h2 id="cv-experience" className="cards-cv-kicker">Experience</h2>
          <div className="cards-cv-rule" aria-hidden="true" />
          {experienceItems.map((item) => {
            const date = getCvEntryDate(item.year)
            const detail = getCvEntryDetail(item.description)
            return (
              <article key={`${item.company}-${item.title}`} className="cards-cv-entry">
                <div className="cards-cv-line">
                  <p className="cards-cv-title">{item.company} · {item.title}</p>
                  {date ? <p className="cards-cv-dates">{date}</p> : null}
                </div>
                {detail ? <p className="cards-cv-detail">{detail}</p> : null}
              </article>
            )
          })}
        </section>

        <section className="cards-cv-section" aria-labelledby="cv-selected-work">
          <h2 id="cv-selected-work" className="cards-cv-kicker">Selected work</h2>
          <div className="cards-cv-rule" aria-hidden="true" />
          {cvSelectedWork.map((item) => (
            <article key={item.slug} className="cards-cv-entry">
              <p className="cards-cv-title">
                <Link className="cards-cv-work-link" href={`/projects/${item.slug}`}>{item.title}</Link>
              </p>
              <p className="cards-cv-detail">{item.summary}</p>
            </article>
          ))}
        </section>

        <section className="cards-cv-section" aria-labelledby="cv-education">
          <h2 id="cv-education" className="cards-cv-kicker">Education</h2>
          <div className="cards-cv-rule" aria-hidden="true" />
          {educationItems.map((item) => {
            const date = getCvEntryDate(item.year)
            return (
              <article key={`${item.institution}-${item.degree}-${item.year}`} className="cards-cv-entry">
                <div className="cards-cv-line">
                  <p className="cards-cv-title">{item.institution} · {item.degree}</p>
                  {date ? <p className="cards-cv-dates">{date}</p> : null}
                </div>
                <p className="cards-cv-detail">{formatCvEducationDetail(item)}</p>
              </article>
            )
          })}
        </section>

        <section className="cards-cv-section" aria-labelledby="cv-tools">
          <h2 id="cv-tools" className="cards-cv-kicker">Tools</h2>
          <div className="cards-cv-rule" aria-hidden="true" />
          <p className="cards-cv-detail cards-cv-tools">{cvTools.join(' · ')}</p>
        </section>
      </div>
    </div>
  )
}
