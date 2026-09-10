import { ContactLinks } from '@/components/home/ContactLinks'
import { Section } from '@/components/home/HomeSection'
import { homeContactContent } from '@/content/homepage'
import { HOME_SECTION_SCROLL_MARGIN_CLASS_NAME } from '@/lib/home-section-nav'

export function HomeContactSection() {
  return (
    <Section id="contact" title="Contact" scrollMarginClassName={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}>
      <div className="space-y-5 sm:space-y-7">
        <div className="space-y-2">
          <p className="max-w-[31rem] font-header text-[0.9rem] font-semibold leading-[1.58] tracking-[-0.02em] text-muted-foreground sm:text-[0.96rem] sm:leading-[1.65]">
            {homeContactContent.line}
          </p>
        </div>
        <ContactLinks />
      </div>
    </Section>
  )
}
