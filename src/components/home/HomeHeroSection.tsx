'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowDown, ArrowUpRight, Mountain } from 'lucide-react'
import { useWebHaptics } from 'web-haptics/react'
import { homeHeroContent } from '@/content/homepage'
import {
  HOME_HERO_LOCAL_TIME_UPDATE_MS,
  formatHomeHeroLocalTime,
  getHomeHeroLocalTimeToggleLabel,
  getNextHomeHeroLocalTimeFormat,
  type HomeHeroLocalTimeFormat,
} from '@/lib/home-hero'
import { analytics } from '@/lib/analytics'

export function HomeHeroSection() {
  const haptic = useWebHaptics()
  const [localTime, setLocalTime] = useState('')
  const [localTimeFormat, setLocalTimeFormat] = useState<HomeHeroLocalTimeFormat>('standard')

  useEffect(() => {
    const updateTime = () => setLocalTime(formatHomeHeroLocalTime(new Date(), localTimeFormat))
    updateTime()
    const timer = window.setInterval(updateTime, HOME_HERO_LOCAL_TIME_UPDATE_MS)
    return () => window.clearInterval(timer)
  }, [localTimeFormat])

  return (
    <section className="hb-hero" aria-labelledby="home-title">
      <div className="hb-hero-copy">
        <p className="hb-eyebrow"><span className="hb-index">01 /</span> Design, code & the outdoors</p>
        <h1 id="home-title">Hunter<br />Bastian<span className="hb-orange">.</span></h1>
        <p className="hb-intro">{homeHeroContent.intro}</p>
        <div className="hb-hero-actions">
          <a href="#projects" className="hb-button hb-button-primary" onClick={() => analytics.navigationClick('projects')}>
            Explore my work <ArrowDown size={16} aria-hidden="true" />
          </a>
          <Link href="/cv" className="hb-text-link" onClick={() => analytics.navigationClick('resume')}>
            Resume <ArrowUpRight size={16} aria-hidden="true" />
          </Link>
          <a href="#contact" className="hb-text-link" onClick={() => analytics.navigationClick('contact')}>Say hello</a>
        </div>
      </div>
      <figure className="hb-field-image">
        <Link href="/projects/mountain" className="hb-field-image-link" aria-label="View Mountain, a visual study">
          <Image src="/images/optimized/projects/mountain.webp"
            alt="An abstract mountain landscape, with streaks of light across the peaks and trees."
            fill priority sizes="(max-width: 767px) calc(100vw - 40px), (max-width: 1100px) 44vw, 460px"
            className="hb-mountain-image" />
          <span className="hb-photo-label"><Mountain size={16} aria-hidden="true" /> Outside, in motion.</span>
          <span className="hb-photo-open"><ArrowUpRight size={18} aria-hidden="true" /></span>
        </Link>
        <figcaption><span>Mountain study</span><span>From the visual archive</span></figcaption>
      </figure>
      <div className="hb-location-strip">
        <div className="hb-location-person">
          <Image src="/images/profilepicture.webp" alt="Hunter on a mountain road" width={40} height={40} className="hb-avatar" />
          <div><span className="hb-meta-label">Basecamp</span><span>{homeHeroContent.subtitle}</span></div>
        </div>
        <div><span className="hb-meta-label">Currently</span><span>Interaction Design at UVU</span></div>
        <div className="hb-local-time"><span className="hb-meta-label">Local time</span>
          {localTime ? (
            <button type="button" aria-label={getHomeHeroLocalTimeToggleLabel(localTimeFormat, localTime)} onClick={() => {
              haptic.trigger('light')
              setLocalTimeFormat(getNextHomeHeroLocalTimeFormat)
            }}><time>{localTime}</time><span className="hb-time-zone"> MT</span></button>
          ) : <span aria-hidden="true">— MT</span>}
        </div>
      </div>
    </section>
  )
}
