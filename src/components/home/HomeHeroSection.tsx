'use client'

import { useWebHaptics } from 'web-haptics/react'
import Link from 'next/link'
import * as Button from '@/components/alignui/button'
import { ContactLinks } from '@/components/home/ContactLinks'
import { homeHeroContent } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  HOME_HERO_ACTIONS,
  activateHomeHeroAction,
} from '@/lib/home-hero'
import { HOME_SECTION_SCROLL_MARGIN_CLASS_NAME } from '@/lib/home-section-nav'
import { showJoyToast } from '@/lib/joy'

export function HomeHeroSection() {
  const haptic = useWebHaptics()

  return (
    <section id="home" className={`home-hero-grid ${HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}`}>
      <h1 className="home-statement-title preserve-name-case" aria-label={homeHeroContent.intro}>
        I design and build <em>thoughtful</em> digital experiences.
      </h1>
      <div className="home-hero-aside">
        <p className="home-statement-meta preserve-name-case">
          Interaction design &amp; development<br />
          {homeHeroContent.subtitle}
        </p>
        <div id="contact" className={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}>
          <ContactLinks
            emailLabel="Email me"
            primaryAction={
              <>
                {HOME_HERO_ACTIONS.map((action) => (
                  <Button.Root
                    key={action.label}
                    asChild
                    mode="stroke"
                    onClick={() =>
                      activateHomeHeroAction({
                        action,
                        showToast: showJoyToast,
                        trackNavigationClick: (target) => analytics.navigationClick(target),
                        triggerHaptic: (style) => haptic.trigger(style),
                      })
                    }
                  >
                    <Link href={action.href} title={action.peek}>{action.label}</Link>
                  </Button.Root>
                ))}
              </>
            }
          />
        </div>
      </div>
    </section>
  )
}
