import Link from 'next/link'

import DenverClock from '@/components/cards/DenverClock'
import { HOME_SHOWCASE_LOCATION, HOME_SHOWCASE_ROLE } from '@/lib/home-showcase'
import { siteConfig } from '@/lib/site'

export default function CardsHeader({ heading = false }: { heading?: boolean }) {
  const name = siteConfig.personName

  return (
    <header className="cards-header">
      <div className="cards-identity">
        {heading ? (
          <h1 className="cards-name">{name}</h1>
        ) : (
          <Link className="cards-name cards-name-link" href="/">
            {name}
          </Link>
        )}
        <p className="cards-role">
          {HOME_SHOWCASE_ROLE}
          <span aria-hidden="true"> · </span>
          {HOME_SHOWCASE_LOCATION}
        </p>
      </div>
      <DenverClock />
    </header>
  )
}
