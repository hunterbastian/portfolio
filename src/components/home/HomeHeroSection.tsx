'use client'

import { useWebHaptics } from 'web-haptics/react'
import { PeekAction } from '@/components/PeekAction'
import { ContactLinks } from '@/components/home/ContactLinks'
import { homeHeroContent } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  HOME_HERO_ACTIONS,
  activateHomeHeroAction,
  getHomeHeroActionClassName,
  getHomeHeroActionLabelClassName,
} from '@/lib/home-hero'
import { HOME_SECTION_SCROLL_MARGIN_CLASS_NAME } from '@/lib/home-section-nav'
import { showJoyToast } from '@/lib/joy'

export function HomeHeroSection() {
  const haptic = useWebHaptics()

  return (
    <section id="home" className={HOME_SECTION_SCROLL_MARGIN_CLASS_NAME}>
      <h1 className="home-statement-title preserve-name-case" aria-label={homeHeroContent.intro}>
        <span>I design and</span>{' '}
        <span>build thoughtful</span>{' '}
        <span>digital</span>{' '}
        <span>experiences.</span>
      </h1>
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
                <PeekAction
                  key={action.label}
                  href={action.href}
                  peek={action.peek}
                  className={getHomeHeroActionClassName(action.variant)}
                  labelClassName={getHomeHeroActionLabelClassName(action.variant)}
                  onClick={() =>
                    activateHomeHeroAction({
                      action,
                      showToast: showJoyToast,
                      trackNavigationClick: (target) => analytics.navigationClick(target),
                      triggerHaptic: (style) => haptic.trigger(style),
                    })
                  }
                >
                  {action.label}
                </PeekAction>
              ))}
            </>
          }
        />
      </div>
    </section>
  )
}
