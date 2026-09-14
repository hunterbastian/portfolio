import { EditorialItem } from '@/components/home/EditorialItem'
import { Section } from '@/components/home/HomeSection'
import { backgroundBeats } from '@/content/homepage'
import { getHomeBackgroundDisplayItem } from '@/lib/home-background'
import { HOME_SECTION_SCROLL_MARGIN_CLASS_NAME } from '@/lib/home-section-nav'

export function HomeBackgroundSection() {
  return (
    <Section
      id="background"
      title="Background"
      contentGapClassName="space-y-1.5 sm:space-y-2"
      scrollMarginClassName={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}
    >
      <div className="space-y-1.5 sm:space-y-2.5">
        {backgroundBeats.map((item) => {
          const displayItem = getHomeBackgroundDisplayItem(item)

          return (
            <EditorialItem
              key={displayItem.key}
              eyebrow={displayItem.eyebrow}
              eyebrowClassName="font-mono font-normal text-muted-foreground/42 group-hover:text-muted-foreground/58"
              title={displayItem.title}
              titleFontClassName="font-header font-medium"
              description={displayItem.description}
              compact
            />
          )
        })}
      </div>
    </Section>
  )
}
