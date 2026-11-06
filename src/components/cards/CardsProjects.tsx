import Image from 'next/image'
import Link from 'next/link'

import { Card } from '@/components/cards/card'
import CardsHeader from '@/components/cards/CardsHeader'
import { cardsFont } from '@/lib/cards-font'
import { getPortfolioProjectCards, type PortfolioProjectSource } from '@/lib/cards-portfolio'
import { BLANK_LINK_TARGET, SAFE_BLANK_LINK_REL } from '@/lib/link-safety'

function ProjectCardBody({
  category,
  imageSrc,
  title,
  year,
}: {
  category: string
  imageSrc: string
  title: string
  year: string
}) {
  return (
    <>
      <div className="cards-frame">
        <Image
          alt=""
          className="cards-frame-image"
          fill
          sizes="(min-width: 1100px) 340px, 46vw"
          src={imageSrc}
        />
      </div>
      <div className="cards-rule" aria-hidden="true" />
      <div className="cards-project-copy">
        <div className="cards-project-title-row">
          <h2 className="cards-project-title">{title}</h2>
          <span className="cards-project-year">{year}</span>
        </div>
        <p className="cards-project-category">{category}</p>
      </div>
    </>
  )
}

export default function CardsProjects({ projects }: { projects: readonly PortfolioProjectSource[] }) {
  const cards = getPortfolioProjectCards(projects)

  return (
    <div className={`cards-root ${cardsFont.className}`}>
      <div className="cards-frame-page">
        <CardsHeader />
        <div className="cards-header-rule" aria-hidden="true" />
        <h1 className="cards-page-title">Projects</h1>
        <ul className="cards-project-grid">
          {cards.map((card) => {
            const body = (
              <ProjectCardBody
                category={card.category}
                imageSrc={card.imageSrc}
                title={card.title}
                year={card.year}
              />
            )

            return (
              <li key={card.id}>
                <Card className="cards-project-card">
                  {card.href && card.external ? (
                    <a className="cards-project-hit" href={card.href} rel={SAFE_BLANK_LINK_REL} target={BLANK_LINK_TARGET}>
                      {body}
                    </a>
                  ) : card.href ? (
                    <Link className="cards-project-hit" href={card.href}>
                      {body}
                    </Link>
                  ) : (
                    body
                  )}
                </Card>
              </li>
            )
          })}
        </ul>
      </div>
    </div>
  )
}
