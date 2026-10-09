'use client'

import Link from 'next/link'
import MobileNavigation from '@/components/MobileNavigation'
import { useEffect, useState } from 'react'
import {
  formatHomeHeroLocalTime,
  getHomeHeroLocalTimeAriaLabel,
  getHomeHeroLocalTimeDelayMs,
  HOME_HERO_LOCAL_TIME_UPDATE_MS,
  HOME_HERO_LOCAL_TIME_ZONE,
} from '@/lib/home-hero'

function getClock(date: Date) {
  const zone = new Intl.DateTimeFormat('en-US', {
    timeZone: HOME_HERO_LOCAL_TIME_ZONE,
    timeZoneName: 'short',
  }).formatToParts(date).find((part) => part.type === 'timeZoneName')?.value ?? 'MT'
  return { time: formatHomeHeroLocalTime(date), zone }
}

export function HomeMasthead() {
  const [clock, setClock] = useState<ReturnType<typeof getClock> | null>(null)

  useEffect(() => {
    let intervalId = 0
    const now = new Date()
    const tick = () => setClock(getClock(new Date()))
    tick()
    const timeoutId = window.setTimeout(() => {
      tick()
      intervalId = window.setInterval(tick, HOME_HERO_LOCAL_TIME_UPDATE_MS)
    }, getHomeHeroLocalTimeDelayMs(now))
    return () => {
      window.clearTimeout(timeoutId)
      window.clearInterval(intervalId)
    }
  }, [])

  return (
    <header className="home-masthead preserve-name-case">
      <div className="home-masthead-inner">
        <Link href="/" className="home-masthead-name"><span>Hunter Bastian<span className="brand-period">.</span></span></Link>
        <div className="flex items-center gap-2 sm:gap-4"><time dateTime={clock?.time} aria-live="off" aria-label={clock ? getHomeHeroLocalTimeAriaLabel(clock.time) : 'Local time in Lehi'}>
          {clock ? `${clock.zone} ${clock.time}` : 'MT --:--'}
        </time><div className="sm:hidden"><MobileNavigation /></div></div>
      </div>
    </header>
  )
}
