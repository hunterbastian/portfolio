import Link from 'next/link'
import { backgroundBeats, homePhilosophyContent, homeHeroContent } from '@/content/homepage'
import { getHomeHeroIntroParagraphs } from '@/lib/home-hero'
import { getHomeBackgroundDisplayItem } from '@/lib/home-background'

export function HomeBackgroundSection() {
  return (
    <section id="background" className="editorial-section editorial-about" aria-labelledby="about-heading">
      <div>
        <p className="editorial-eyebrow">About</p>
        <h2 id="about-heading">A quieter approach.</h2>
        <p className="editorial-about-intro">{homePhilosophyContent.body}</p>
        <p className="editorial-project-description mb-6">{getHomeHeroIntroParagraphs(homeHeroContent.intro)[1]}</p>
        <Link href="/cv" className="editorial-text-link">View résumé <span aria-hidden="true">↗</span></Link>
      </div>
      <div className="editorial-timeline">
        {backgroundBeats.map((item) => {
          const displayItem = getHomeBackgroundDisplayItem(item)
          return (
            <div key={displayItem.key} className="editorial-timeline-row">
              <p className="editorial-eyebrow">{displayItem.eyebrow}</p>
              <h3>{displayItem.title}</h3>
              <p>{displayItem.description}</p>
            </div>
          )
        })}
      </div>
    </section>
  )
}
