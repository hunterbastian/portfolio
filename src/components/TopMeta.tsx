'use client'

import { usePathname } from 'next/navigation'

interface TopMetaProps {
  coordinates: string
  location: string
  season: string
}

export default function TopMeta({ coordinates, location, season }: TopMetaProps) {
  const pathname = usePathname()

  if (pathname.startsWith('/projects/')) {
    return null
  }

  return (
    <>
      <p
        className="pointer-events-none absolute left-4 top-4 z-50 select-none text-[10px] tracking-[0.12em] text-foreground opacity-90 sm:left-6 sm:top-6 sm:text-[11px]"
        aria-label={`Coordinates ${coordinates}`}
        style={{ fontFamily: 'inherit' }}
      >
        {coordinates}
      </p>
      <p
        className="pointer-events-none absolute right-4 top-4 z-50 inline-flex items-center gap-1.5 select-none text-[10px] tracking-[0.12em] text-foreground opacity-90 sm:right-6 sm:top-6 sm:gap-2 sm:text-[11px]"
        aria-label={`Location ${location}, season ${season}`}
        style={{ fontFamily: 'inherit' }}
      >
        <span>{location}</span>
        <span aria-hidden="true" className="opacity-60">/</span>
        <span className="opacity-80">{season}</span>
      </p>
    </>
  )
}
