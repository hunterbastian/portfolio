import { EditorialItem } from '@/components/home/EditorialItem'
import { Section } from '@/components/home/HomeSection'
import { experienceItems } from '@/content/homepage'
import { getHomeExperienceDisplayItem } from '@/lib/home-credentials'

export function HomeExperienceSection() {
  return (
    <Section title="Experience">
      <div className="space-y-3 sm:space-y-5">
        {experienceItems.map((item) => {
          const displayItem = getHomeExperienceDisplayItem(item)

          return (
            <EditorialItem
              key={displayItem.key}
              eyebrow={displayItem.eyebrow}
              eyebrowClassName="font-mono text-muted-foreground/45 group-hover:text-muted-foreground/58"
              title={displayItem.title}
              description={displayItem.description}
            />
          )
        })}
      </div>
    </Section>
  )
}
