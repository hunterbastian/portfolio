import Image from 'next/image'
import { creatingLinks } from '@/content/homepage'
import { studioWork } from '@/content/studio-work'
import { getHomeEndeavorDescription } from '@/lib/home-endeavors'
import { StudioWorkStack } from './StudioWorkStack'

export function HomeEndeavorsSection() {
  const studios = creatingLinks.filter((link) => studioWork[link.label])
  const sideProjects = creatingLinks.filter((link) => !studioWork[link.label])

  return (
    <section id="studios" className="editorial-section" aria-labelledby="studios-heading">
      <div className="editorial-section-heading">
        <h2 id="studios-heading">Independent studios</h2>
        <p className="editorial-section-note">Photography, design, and the spaces between.</p>
      </div>
      <div className="editorial-project-grid">
        {studios.map((link) => {
          const examples = studioWork[link.label]
          const cover = examples[0]
          return (
            <div key={link.label} className="editorial-studio">
              <a className="editorial-project" href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel}>
                <div className="editorial-project-image">
                  <Image src={cover.image} alt={cover.alt} fill sizes="(max-width: 699px) calc(100vw - 48px), 44vw" className="object-cover" />
                </div>
                <div className="editorial-project-caption">
                  <h3>{link.label}</h3>
                  <span aria-hidden="true">↗</span>
                </div>
                <p className="editorial-project-description">{getHomeEndeavorDescription(link.label)}</p>
              </a>
              <div className="editorial-studio-examples">
                <StudioWorkStack compact studio={link.label} examples={examples} print={link.iconType === 'studio-alpine'} />
              </div>
            </div>
          )
        })}
      </div>
      <div className="editorial-more-work">
        <p className="editorial-eyebrow">Side projects</p>
        {sideProjects.map((link) => (
          <a key={link.label} href={link.href} target="_blank" rel="noopener noreferrer" aria-label={link.ariaLabel} className="editorial-index-row editorial-side-project">
            <span>{link.label}</span>
            <span className="editorial-project-description">{getHomeEndeavorDescription(link.label)}</span>
            <span aria-hidden="true">↗</span>
          </a>
        ))}
      </div>
    </section>
  )
}
