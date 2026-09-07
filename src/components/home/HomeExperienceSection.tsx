import { EditorialItem } from '@/components/home/EditorialItem'
import { Section } from '@/components/home/HomeSection'
import { experienceItems } from '@/content/homepage'
import { getHomeExperienceDisplayItem } from '@/lib/home-credentials'

export function HomeExperienceSection() {
  return (
    <Section title="Experience" contentGapClassName="space-y-1.5 sm:space-y-2">
      <div className="space-y-1.5 sm:space-y-2.5">
        {experienceItems.map((item) => {
          const displayItem = getHomeExperienceDisplayItem(item)

          return (
            <EditorialItem
              key={displayItem.key}
              eyebrow={displayItem.eyebrow}
              eyebrowClassName="font-mono text-muted-foreground group-hover:text-muted-foreground"
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
