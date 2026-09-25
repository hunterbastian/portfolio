'use client'

import Image from 'next/image'
import { useWebHaptics } from 'web-haptics/react'
import { PeekAction } from '@/components/PeekAction'
import { ContactLinks } from '@/components/home/ContactLinks'
import { homeHeroContent } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import { HOME_HERO_ACTIONS, activateHomeHeroAction, getHomeHeroIntroParagraphs } from '@/lib/home-hero'
import { showJoyToast } from '@/lib/joy'

export function HomeHeroSection() {
  const haptic = useWebHaptics()
  const [intro] = getHomeHeroIntroParagraphs(homeHeroContent.intro)

  return (
    <section id="home" className="editorial-hero">
      <div className="editorial-hero-scenery" aria-hidden="true">
        <Image src="/images/grainwave-b-preview.webp" alt="" fill priority sizes="100vw" className="object-cover" />
      </div>
      <div className="editorial-container editorial-hero-content">
        <h1 className="editorial-wordmark">{homeHeroContent.headline}</h1>
        <p className="editorial-location">{homeHeroContent.subtitle}</p>
        <p className="editorial-intro">{intro}</p>
        <div id="contact" className="editorial-hero-actions">
          {HOME_HERO_ACTIONS.map((action) => (
            <PeekAction
              key={action.label}
              href={action.href}
              className="editorial-text-link"
              onClick={() => activateHomeHeroAction({
                action,
                showToast: showJoyToast,
                trackNavigationClick: (target) => analytics.navigationClick(target),
                triggerHaptic: (style) => haptic.trigger(style),
              })}
            >
              {action.label}
            </PeekAction>
          ))}
          <ContactLinks />
        </div>
      </div>
    </section>
  )
}
