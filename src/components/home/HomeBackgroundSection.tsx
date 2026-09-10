import { EditorialItem } from '@/components/home/EditorialItem'
import { Section } from '@/components/home/HomeSection'
import { backgroundBeats } from '@/content/homepage'
import { getHomeBackgroundDisplayItem } from '@/lib/home-background'

export function HomeBackgroundSection() {
  return (
    <Section title="Background" contentGapClassName="space-y-1.5 sm:space-y-2">
      <div className="space-y-1.5 sm:space-y-2.5">
        {backgroundBeats.map((item) => {
          const displayItem = getHomeBackgroundDisplayItem(item)

          return (
            <EditorialItem
              key={displayItem.key}
              eyebrow={displayItem.eyebrow}
              eyebrowClassName="font-mono text-muted-foreground/45 group-hover:text-muted-foreground/58"
              title={displayItem.title}
              description={displayItem.description}
              compact
            />
          )
        })}
      </div>
    </Section>
  )
}
