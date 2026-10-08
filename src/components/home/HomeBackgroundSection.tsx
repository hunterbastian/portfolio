import { Section } from '@/components/home/HomeSection'
import { backgroundBeats } from '@/content/homepage'
import { getHomeBackgroundDisplayItem } from '@/lib/home-background'
import { HOME_SECTION_SCROLL_MARGIN_CLASS_NAME } from '@/lib/home-section-nav'

export function HomeBackgroundSection() {
  return (
    <Section
      id="background"
      title="Background"
      meta="Experience & education"
      contentGapClassName="space-y-1.5 sm:space-y-2"
      scrollMarginClassName={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}
    >
      <ol className="home-background-list">
        {backgroundBeats.map((item) => {
          const displayItem = getHomeBackgroundDisplayItem(item)

          return (
            <li key={displayItem.key} className="home-background-row">
              <p className="home-background-date">{displayItem.eyebrow}</p>
              <h3>{displayItem.title}</h3>
              <p className="home-background-description">{displayItem.description}</p>
            </li>
          )
        })}
      </ol>
    </Section>
  )
}
