'use client'

import { useEffect, useState } from 'react'
import { useWebHaptics } from 'web-haptics/react'
import { PeekAction } from '@/components/PeekAction'
import { ContactLinks } from '@/components/home/ContactLinks'
import { homeContactContent, homeHeroContent } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  HOME_HERO_ACTIONS,
  HOME_HERO_CONTACT_LINE_CLASS_NAME,
  HOME_HERO_INTRO_CLASS_NAME,
  HOME_HERO_LOCAL_TIME_CLASS_NAME,
  HOME_HERO_LOCAL_TIME_SEPARATOR_CLASS_NAME,
  HOME_HERO_LOCAL_TIME_UPDATE_MS,
  HOME_HERO_LOCATION_LABEL_CLASS_NAME,
  HOME_HERO_LOCATION_META_CLASS_NAME,
  HOME_HERO_NAME_CLASS_NAME,
  activateHomeHeroAction,
  formatHomeHeroLocalTime,
  getHomeHeroActionClassName,
  getHomeHeroActionLabelClassName,
  getHomeHeroIntroParagraphs,
  getHomeHeroLocalTimeAriaLabel,
  getHomeHeroLocalTimeDelayMs,
} from '@/lib/home-hero'
import { HOME_SECTION_SCROLL_MARGIN_CLASS_NAME } from '@/lib/home-section-nav'
import { showJoyToast } from '@/lib/joy'

function useHomeHeroLocalTime() {
  const [localTime, setLocalTime] = useState('')

  useEffect(() => {
    let intervalId = 0
    const now = new Date()

    setLocalTime(formatHomeHeroLocalTime(now))

    const timeoutId = window.setTimeout(() => {
      const tick = () => setLocalTime(formatHomeHeroLocalTime(new Date()))

      tick()
      intervalId = window.setInterval(tick, HOME_HERO_LOCAL_TIME_UPDATE_MS)
    }, getHomeHeroLocalTimeDelayMs(now))

    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [])

  return localTime
}

const homeHeroIntroStackClassName = 'home-editorial-intro space-y-7 pt-5 sm:space-y-8 sm:pt-7'

export function HomeHeroSection() {
  const introParagraphs = getHomeHeroIntroParagraphs(homeHeroContent.intro)
  const haptic = useWebHaptics()
  const localTime = useHomeHeroLocalTime()

  return (
    <section
      id="home"
      className={`relative isolate ${HOME_SECTION_SCROLL_MARGIN_CLASS_NAME} pb-2 sm:pb-3`}
    >
      <div className="relative z-10 space-y-5 sm:space-y-7">
        <div className="space-y-3.5 sm:space-y-4">
          <p className="home-editorial-kicker">Selected work &amp; experiments</p>
          <div className="space-y-1">
            <h1 className={`preserve-name-case ${HOME_HERO_NAME_CLASS_NAME}`}>
              {homeHeroContent.headline}
            </h1>
          </div>
        </div>

        <div className={homeHeroIntroStackClassName}>
          {introParagraphs.map((paragraph) => (
            <p key={paragraph} className={HOME_HERO_INTRO_CLASS_NAME}>
              {paragraph}
            </p>
          ))}
        </div>

        <dl className="home-editorial-details">
          <div>
            <dt>Discipline</dt>
            <dd>Interaction design &amp; development</dd>
          </div>
          <div>
            <dt>Based in</dt>
            <dd className={HOME_HERO_LOCATION_META_CLASS_NAME}>
              <span className={HOME_HERO_LOCATION_LABEL_CLASS_NAME}>{homeHeroContent.subtitle}</span>
              {localTime ? (
                <>
                  <span aria-hidden="true" className={HOME_HERO_LOCAL_TIME_SEPARATOR_CLASS_NAME}>·</span>
                  <time
                    dateTime={localTime}
                    aria-live="off"
                    aria-label={getHomeHeroLocalTimeAriaLabel(localTime)}
                    className={HOME_HERO_LOCAL_TIME_CLASS_NAME}
                  >
                    {localTime}
                  </time>
                </>
              ) : null}
            </dd>
          </div>
        </dl>

        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1.5 sm:gap-x-5 sm:gap-y-2.5">
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
        </div>

        <div
          id="contact"
          className={`${HOME_SECTION_SCROLL_MARGIN_CLASS_NAME} space-y-4 pt-1 sm:space-y-5 sm:pt-2`}
        >
          <p className={HOME_HERO_CONTACT_LINE_CLASS_NAME}>{homeContactContent.line}</p>
          <ContactLinks />
        </div>
      </div>
    </section>
  )
}
