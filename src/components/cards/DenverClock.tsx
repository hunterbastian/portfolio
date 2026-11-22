'use client'

import { useEffect, useState, type ReactNode } from 'react'

import { formatDenverClock } from '@/lib/home-showcase'

const CLOCK_PLACEHOLDER = '00:00:00 MDT'

function ClockReadout({ label }: { label: string }) {
  const pieces = label.split(':')
  const nodes: ReactNode[] = []

  pieces.forEach((piece, index) => {
    if (index > 0) {
      nodes.push(
        <span key={`colon-${index}`} className="cards-clock-colon" aria-hidden="true">
          :
        </span>,
      )
    }
    nodes.push(<span key={`part-${index}`}>{piece}</span>)
  })

  return <>{nodes}</>
}

export default function DenverClock() {
  const [label, setLabel] = useState('')

  useEffect(() => {
    const tick = () => setLabel(formatDenverClock(new Date()))
    tick()
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [])

  const shown = label || CLOCK_PLACEHOLDER

  return (
    <time
      className="cards-clock"
      dateTime={label || undefined}
      aria-hidden={label ? undefined : true}
    >
      <span className={label ? undefined : 'cards-clock-sizer'}>
        <ClockReadout label={shown} />
      </span>
    </time>
  )
}
