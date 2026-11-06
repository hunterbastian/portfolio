import { GeistSerifRegular } from 'geist/font/serif/regular'
import Link from 'next/link'

import CardsHeader from '@/components/cards/CardsHeader'
import EmailCopyLink from '@/components/showcase/EmailCopyLink'
import { getCardsHomeBio, getCardsHomeLinks } from '@/lib/cards-portfolio'
import { cardsFont } from '@/lib/cards-font'
import { BLANK_LINK_TARGET, SAFE_BLANK_LINK_REL, isExternalHttpHref } from '@/lib/link-safety'

export default function CardsHome() {
  const bio = getCardsHomeBio()
  const links = getCardsHomeLinks()

  return (
    <div className={`cards-root ${cardsFont.className}`}>
      <div className="cards-frame-page cards-home">
        <CardsHeader heading />
        <div className="cards-home-hero">
          <div className={`cards-bio ${GeistSerifRegular.variable}`}>
            <p>{bio.body}</p>
            <p>{bio.hire}</p>
          </div>
        </div>
        <nav className="cards-nav" aria-label="Links">
          {links.map((item) => {
            if (item.copyOnClick) {
              return (
                <EmailCopyLink key={item.label} className="cards-text-link" href={item.href}>
                  {item.label}
                </EmailCopyLink>
              )
            }

            if (item.external) {
              const newTab = isExternalHttpHref(item.href)
              return (
                <a
                  key={item.label}
                  className="cards-text-link"
                  href={item.href}
                  rel={newTab ? SAFE_BLANK_LINK_REL : undefined}
                  target={newTab ? BLANK_LINK_TARGET : undefined}
                >
                  {item.label}
                </a>
              )
            }

            return (
              <Link key={item.label} className="cards-text-link" href={item.href}>
                {item.label}
              </Link>
            )
          })}
        </nav>
      </div>
    </div>
  )
}
