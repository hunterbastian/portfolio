'use client'

import { useEffect, useState } from 'react'

import { formatDenverClock } from '@/lib/home-showcase'

const CLOCK_PLACEHOLDER = '00:00:00 MDT'

export default function DenverClock() {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const tick = () => setLabel(formatDenverClock(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  return (
    <time
      className="cards-clock"
      dateTime={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <span className={label ? undefined : 'cards-clock-sizer'}>{label || CLOCK_PLACEHOLDER}</span>
    </time>
  )
}
