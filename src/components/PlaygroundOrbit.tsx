'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { useAnimationFrame, useMotionValue, useReducedMotion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { MobilePlayground } from '@/components/playground/MobilePlayground'
import { PlaygroundCenterHub } from '@/components/playground/PlaygroundCenterHub'
import { PlaygroundOrbitCard } from '@/components/playground/PlaygroundOrbitCard'
import { useOrbitRadius } from '@/components/playground/useOrbitRadius'
import {
  getNextPlaygroundOrbitAnimationFrame,
  getPlaygroundOrbitViewState,
  PLAYGROUND_DEFAULT_ORBIT_RADIUS_DESKTOP,
  PLAYGROUND_DEFAULT_ORBIT_RADIUS_LARGE,
  PLAYGROUND_ORBIT_ENTRANCE,
  PLAYGROUND_ORBIT_NORMAL_SPEED,
  PLAYGROUND_ORBIT_SLOW_SPEED,
  schedulePlaygroundOrbitActivation,
} from '@/lib/playground'
import type { Project } from '@/types/project'

interface PlaygroundOrbitProps {
  projects: Project[]
  radiusDesktop?: number
  radiusLarge?: number
}

export default function PlaygroundOrbit({
  projects,
  radiusDesktop = PLAYGROUND_DEFAULT_ORBIT_RADIUS_DESKTOP,
  radiusLarge = PLAYGROUND_DEFAULT_ORBIT_RADIUS_LARGE,
}: PlaygroundOrbitProps) {
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [orbitActive, setOrbitActive] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const orbitState = getPlaygroundOrbitViewState(projects, hoveredIndex)
  const count = orbitState.count
  const rotation = useMotionValue(0)
  const speedRef = useRef(0)
  const orbitRadius = useOrbitRadius(radiusDesktop, radiusLarge)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = schedulePlaygroundOrbitActivation({
      projectCount: count,
      scheduleActivation: (delayMs) => setTimeout(() => setOrbitActive(true), delayMs),
      timing: PLAYGROUND_ORBIT_ENTRANCE,
    })

    return () => clearTimeout(timer)
  }, [count])

  useAnimationFrame(() => {
    if (prefersReducedMotion) return
    const nextOrbit = getNextPlaygroundOrbitAnimationFrame({
      currentRotation: rotation.get(),
      currentSpeed: speedRef.current,
      normalSpeed: PLAYGROUND_ORBIT_NORMAL_SPEED,
      orbitActive,
      selection: orbitState.selection,
      slowSpeed: PLAYGROUND_ORBIT_SLOW_SPEED,
    })

    speedRef.current = nextOrbit.speed

    if (nextOrbit.rotation !== rotation.get()) {
      rotation.set(nextOrbit.rotation)
    }
  })

  const handleHoverStart = useCallback((index: number) => setHoveredIndex(index), [])
  const handleHoverEnd = useCallback(() => setHoveredIndex(null), [])

  if (!orbitState.canRender || orbitState.activeHub === null) {
    return null
  }

  return (
    <div className="h-full">
      <MobilePlayground projects={projects} />

      <div className="playground-orbit-stage relative hidden h-full md:block" onMouseLeave={handleHoverEnd}>
        <div className="playground-orbit-ring" aria-hidden="true" />
        <div className="playground-route-plane" aria-hidden="true">
          <Plane size={15} strokeWidth={1.7} />
        </div>

        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <PlaygroundCenterHub hub={orbitState.activeHub} />
        </div>

        {mounted
          ? orbitState.cardStates.map((cardState) => (
              <PlaygroundOrbitCard
                key={cardState.project.slug}
                displayState={cardState}
                hasHoverTarget={orbitState.selection.hasHoverTarget}
                rotation={rotation}
                orbitRadius={orbitRadius}
                cardSize={orbitState.cardSize}
                prefersReducedMotion={prefersReducedMotion}
                onHoverStart={() => handleHoverStart(cardState.index)}
                onHoverEnd={handleHoverEnd}
              />
            ))
          : null}
      </div>
    </div>
  )
}
