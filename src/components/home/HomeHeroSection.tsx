'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import { useWebHaptics } from 'web-haptics/react'
import { PeekAction } from '@/components/PeekAction'
import { homeHeroContent } from '@/content/homepage'
import { analytics } from '@/lib/analytics'
import {
  HOME_HERO_ACTIONS,
  HOME_HERO_ACTION_CLASS_NAME,
  HOME_HERO_ACTION_LABEL_CLASS_NAME,
  HOME_HERO_INLINE_LOCAL_TIME_CLASS_NAME,
  HOME_HERO_LOCAL_TIME_UPDATE_MS,
  HOME_HERO_TIME_TOGGLE_CLASS_NAME,
  HOME_HERO_TIME_TOGGLE_HAPTIC_STYLE,
  HOME_HERO_TIME_VALUE_CLASS_NAME,
  activateHomeHeroAction,
  formatHomeHeroLocalTime,
  getHomeHeroLocalTimeToggleLabel,
  getHomeHeroIntroParagraphs,
  getNextHomeHeroLocalTimeFormat,
  type HomeHeroLocalTimeFormat,
} from '@/lib/home-hero'
import { showJoyToast } from '@/lib/joy'
import { useHeroGlow } from '@/lib/use-hero-glow'

const homeHeroIntroStackClassName = 'space-y-7 pt-7 sm:space-y-8 sm:pt-10'
const homeHeroIntroParagraphClassName =
  'w-full max-w-full text-pretty font-header text-[14px] font-normal leading-[1.62] tracking-[-0.012em] text-foreground/92 sm:text-[14px] sm:leading-[1.62]'

export function HomeHeroSection() {
  const introParagraphs = getHomeHeroIntroParagraphs(homeHeroContent.intro)
  const heroGlow = useHeroGlow()
  const haptic = useWebHaptics()
  const [localTime, setLocalTime] = useState('')
  const [localTimeFormat, setLocalTimeFormat] = useState<HomeHeroLocalTimeFormat>('standard')

  useEffect(() => {
    const updateLocalTime = () => setLocalTime(formatHomeHeroLocalTime(new Date(), localTimeFormat))

    updateLocalTime()
    const timer = window.setInterval(updateLocalTime, HOME_HERO_LOCAL_TIME_UPDATE_MS)

    return () => window.clearInterval(timer)
  }, [localTimeFormat])

  return (
    <section
      className="relative isolate pb-2 sm:pb-3"
      onPointerEnter={heroGlow.handlers.onPointerEnter}
      onPointerMove={heroGlow.handlers.onPointerMove}
      onPointerLeave={heroGlow.handlers.onPointerLeave}
    >
      <div
        ref={heroGlow.glowRef}
        aria-hidden="true"
        className={`animated-hero-glow pointer-events-none absolute left-1/2 -top-14 -z-10 h-[27rem] w-[112vw] -translate-x-1/2 overflow-hidden opacity-100 blur-[2.5px] transition-transform duration-[1600ms] ease-soft will-change-transform sm:-top-20 sm:h-[34rem] sm:w-[min(92rem,112vw)] sm:blur-[3.5px] ${
          heroGlow.isActive ? 'is-active' : ''
        }`}
        style={{
          maskImage:
            'radial-gradient(ellipse 56% 54% at 50% 42%, black 0%, rgba(0, 0, 0, 0.88) 28%, rgba(0, 0, 0, 0.42) 58%, rgba(0, 0, 0, 0.1) 82%, transparent 100%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 56% 54% at 50% 42%, black 0%, rgba(0, 0, 0, 0.88) 28%, rgba(0, 0, 0, 0.42) 58%, rgba(0, 0, 0, 0.1) 82%, transparent 100%)',
        }}
      >
        <Image
          src="/images/grainwave-b-preview.webp"
          alt=""
          fill
          loading="eager"
          fetchPriority="low"
          className="scale-[1.02] object-cover object-[50%_48%] saturate-[1.08] brightness-[1.03] contrast-[0.98]"
          sizes="100vw"
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(90deg, rgba(245, 252, 254, 0.18) 0%, transparent 34%, rgba(255, 199, 139, 0.1) 78%, transparent 100%)',
          }}
        />
        <div className="absolute inset-0 bg-background/8" />
      </div>

      <div
        ref={heroGlow.grainRef}
        aria-hidden="true"
        className={`animated-hero-grain pointer-events-none absolute left-[calc(50%+2rem)] -top-10 -z-10 h-[28rem] w-[calc(100vw+2rem)] opacity-[0.04] mix-blend-multiply transition-transform duration-[1800ms] ease-soft will-change-transform sm:left-[calc(50%+7rem)] sm:-top-16 sm:h-[34rem] sm:w-[calc(100vw+14rem)] sm:opacity-[0.065] ${
          heroGlow.isActive ? 'is-active' : ''
        }`}
        style={{
          backgroundImage: "url('/images/hero-grain.svg')",
          backgroundSize: '260px 260px',
          maskImage:
            'radial-gradient(ellipse 60% 48% at 50% 42%, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.32) 48%, transparent 78%)',
          WebkitMaskImage:
            'radial-gradient(ellipse 60% 48% at 50% 42%, rgba(0, 0, 0, 0.64) 0%, rgba(0, 0, 0, 0.32) 48%, transparent 78%)',
        }}
      />

      <div className="relative z-10 space-y-5 sm:space-y-7">
        <div className="space-y-3.5 sm:space-y-4">
          <div className={`space-y-1 `}>
            <h1 className="font-hero-name text-[30px] font-normal leading-[1.15] tracking-[-0.02em] text-foreground/94 sm:text-[36px]">
              {homeHeroContent.headline}
            </h1>
            <p className="font-mono text-[0.76rem] font-medium uppercase leading-none tracking-[0.11em] text-muted-foreground/68">
              {homeHeroContent.subtitle}
            </p>
          </div>
        </div>

        <div className={`${homeHeroIntroStackClassName} `}>
          {introParagraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className={homeHeroIntroParagraphClassName}
            >
              {paragraph}
              {localTime && index === introParagraphs.length - 1 ? (
                <>
                  {' '}
                  <span className={HOME_HERO_INLINE_LOCAL_TIME_CLASS_NAME}>
                    Local time is{' '}
                    <button
                      type="button"
                      className={HOME_HERO_TIME_TOGGLE_CLASS_NAME}
                      aria-label={getHomeHeroLocalTimeToggleLabel(localTimeFormat, localTime)}
                      onClick={() => {
                        haptic.trigger(HOME_HERO_TIME_TOGGLE_HAPTIC_STYLE)
                        setLocalTimeFormat(getNextHomeHeroLocalTimeFormat)
                      }}
                    >
                      <time
                        key={localTime}
                        aria-label={localTime}
                        className={HOME_HERO_TIME_VALUE_CLASS_NAME}
                      >
                        {localTime}
                      </time>
                    </button>
                    .
                  </span>
                </>
              ) : null}
            </p>
          ))}
        </div>

        <div className={`flex flex-wrap items-center gap-x-3.5 gap-y-1.5 sm:gap-x-5 sm:gap-y-2.5 `}>
          {HOME_HERO_ACTIONS.map((action) => (
            <PeekAction
              key={action.label}
              href={action.href}
              peek={action.peek}
              className={HOME_HERO_ACTION_CLASS_NAME}
              labelClassName={HOME_HERO_ACTION_LABEL_CLASS_NAME}
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
