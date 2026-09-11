'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWebHaptics } from 'web-haptics/react'
import { PeekAction } from '@/components/PeekAction'
import { homeHeroContent } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  HOME_HERO_ACTIONS,
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
import { useHeroGlow } from '@/lib/use-hero-glow'

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

const homeHeroIntroStackClassName = 'space-y-7 pt-5 sm:space-y-8 sm:pt-7'

export function HomeHeroSection() {
  const introParagraphs = getHomeHeroIntroParagraphs(homeHeroContent.intro)
  const heroGlow = useHeroGlow()
  const haptic = useWebHaptics()
  const localTime = useHomeHeroLocalTime()

  return (
    <section
      id="home"
      className={`relative isolate ${HOME_SECTION_SCROLL_MARGIN_CLASS_NAME} pb-2 sm:pb-3`}
      onPointerEnter={heroGlow.handlers.onPointerEnter}
      onPointerMove={heroGlow.handlers.onPointerMove}
      onPointerLeave={heroGlow.handlers.onPointerLeave}
    >
      <div
        ref={heroGlow.glowRef}
        aria-hidden="true"
        className={`animated-hero-glow pointer-events-none absolute left-1/2 -top-10 -z-10 h-[18rem] w-[112vw] -translate-x-1/2 overflow-hidden opacity-70 blur-[2.5px] transition-transform duration-[1600ms] ease-soft will-change-transform sm:-top-14 sm:h-[22rem] sm:w-[min(92rem,112vw)] sm:blur-[3.5px] ${
          heroGlow.isActive ? 'is-active' : ''
        }`}
        style={{
          maskImage:
            'radial-gradient(ellipse 52% 48% at 50% 36%, black 0%, rgba(0, 0, 0, 0.72) 26%, rgba(0, 0, 0, 0.28) 54%, rgba(0, 0, 0, 0.06) 76%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 52% 48% at 50% 36%, black 0%, rgba(0, 0, 0, 0.72) 26%, rgba(0, 0, 0, 0.28) 54%, rgba(0, 0, 0, 0.06) 76%, transparent 100%)',
        }}
      >
        <Image
          src="/images/grainwave-b-preview.webp"
          alt=""
          fill
          loading="eager"
          fetchPriority="low"
          className="scale-[1.02] object-cover object-[50%_48%] saturate-[0.92] brightness-[0.82] contrast-[0.96]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(180deg, rgba(25, 25, 25, 0.28) 0%, rgba(25, 25, 25, 0.55) 52%, rgba(25, 25, 25, 0.92) 100%)',
          }}
        />
        <div className="absolute inset-0 bg-[#191919]/35" />
      </div>

      <div
        ref={heroGlow.grainRef}
        aria-hidden="true"
        className={`animated-hero-grain pointer-events-none absolute left-[calc(50%+2rem)] -top-8 -z-10 h-[18rem] w-[calc(100vw+2rem)] opacity-[0.03] mix-blend-multiply transition-transform duration-[1800ms] ease-soft will-change-transform sm:left-[calc(50%+7rem)] sm:-top-12 sm:h-[22rem] sm:w-[calc(100vw+14rem)] sm:opacity-[0.045] ${
          heroGlow.isActive ? 'is-active' : ''
        }`}
        style={{
          backgroundImage: "url('/images/hero-grain.svg')",
          backgroundSize: '260px 260px',
          maskImage:
            'radial-gradient(ellipse 56% 44% at 50% 36%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.22) 48%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 56% 44% at 50% 36%, rgba(0, 0, 0, 0.5) 0%, rgba(0, 0, 0, 0.22) 48%, transparent 78%)',
        }}
      />

      <div className="relative z-10 space-y-5 sm:space-y-7">
        <div className="space-y-3.5 sm:space-y-4">
          <div className="space-y-1">
            <h1 className={HOME_HERO_NAME_CLASS_NAME}>
              {homeHeroContent.headline}
            </h1>
            <p className={HOME_HERO_LOCATION_META_CLASS_NAME}>
              <span className={HOME_HERO_LOCATION_LABEL_CLASS_NAME}>{homeHeroContent.subtitle}</span>
              {localTime ? (
                <>
                  <span aria-hidden="true" className={HOME_HERO_LOCAL_TIME_SEPARATOR_CLASS_NAME}>
                    ·
                  </span>
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
            </p>
          </div>
        </div>

        <div className={homeHeroIntroStackClassName}>
          {introParagraphs.map((paragraph) => (
            <p key={paragraph} className={HOME_HERO_INTRO_CLASS_NAME}>
              {paragraph}
            </p>
          ))}
        </div>

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
      </div>
    </section>
  )
}
