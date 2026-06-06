import { EditorialItem } from '@/components/home/EditorialItem'
import { Section } from '@/components/home/HomeSection'
import { educationItems } from '@/content/homepage'
import { getHomeEducationDisplayItem } from '@/lib/home-credentials'

export function HomeEducationSection() {
  return (
    <Section title="Education">
      <div className="space-y-3 sm:space-y-5">
        {educationItems.map((item) => {
          const displayItem = getHomeEducationDisplayItem(item)

          return (
            <EditorialItem
              key={displayItem.key}
              eyebrow={displayItem.eyebrow}
              title={displayItem.title}
              description={displayItem.description}
            />
          )
        })}
      </div>
    </Section>
  )
}
