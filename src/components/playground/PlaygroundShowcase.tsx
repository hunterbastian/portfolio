'use client'

import { useCallback, useEffect, useLayoutEffect, useRef, useState, type ReactNode } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { m, useAnimationFrame, useMotionValue, useReducedMotion, useTransform } from 'framer-motion'
import type { MotionValue } from 'framer-motion'
import { useOrbitRadius } from '@/components/playground/useOrbitRadius'
import {
  HOME_SHOWCASE_THEME_STORAGE_KEY,
  getShowcaseChrome,
  parseShowcaseThemePreference,
  resolveShowcaseTheme,
  type ShowcaseTheme,
} from '@/lib/home-showcase'
import {
  PLAYGROUND_EMPTY_COPY,
  PLAYGROUND_ORBIT_ENTRANCE,
  PLAYGROUND_ORBIT_NORMAL_SPEED,
  PLAYGROUND_ORBIT_RADIUS_DESKTOP,
  PLAYGROUND_ORBIT_RADIUS_LARGE,
  PLAYGROUND_ORBIT_SLOW_SPEED,
  formatPlaygroundShowcaseCaption,
  getNextPlaygroundOrbitAnimationFrame,
  getPlaygroundOrbitCardFrame,
  getPlaygroundOrbitCardZIndex,
  getPlaygroundOrbitViewState,
  getPlaygroundShowcaseHref,
  schedulePlaygroundOrbitActivation,
} from '@/lib/playground'
import { siteConfig } from '@/lib/site'
import type { Project } from '@/types/project'

interface PlaygroundShowcaseProps {
  className?: string
  projects: Project[]
}

function readShowcaseThemePreference() {
  try {
    return parseShowcaseThemePreference(localStorage.getItem(HOME_SHOWCASE_THEME_STORAGE_KEY))
  } catch {
    return 'system' as const
  }
}

function writeShowcaseThemePreference(theme: ShowcaseTheme) {
  try {
    localStorage.setItem(HOME_SHOWCASE_THEME_STORAGE_KEY, theme)
  } catch {
    // Private browsing can reject storage. The choice still applies for this view.
  }
}

function applyPlaygroundShowcaseTheme(theme: ShowcaseTheme) {
  const chrome = getShowcaseChrome(theme === 'dark')
  const root = document.documentElement
  root.dataset.homeShowcase = 'true'
  root.dataset.playgroundShowcase = 'true'
  root.dataset.homeShowcaseTheme = theme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', chrome.canvas)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', chrome.colorScheme)
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', chrome.statusBar)
}

function clearPlaygroundShowcaseTheme() {
  const root = document.documentElement
  delete root.dataset.homeShowcase
  delete root.dataset.playgroundShowcase
  delete root.dataset.homeShowcaseTheme
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', siteConfig.themeColorDark)
  document.querySelector('meta[name="color-scheme"]')?.setAttribute('content', 'dark')
  document.querySelector('meta[name="apple-mobile-web-app-status-bar-style"]')?.setAttribute('content', 'black')
}

function TextArrow() {
  return (
    <span className="playground-showcase-arrow" aria-hidden="true">
      {'↗\uFE0E'}
    </span>
  )
}

function ExperimentLink({
  children,
  className,
  project,
}: {
  children: ReactNode
  className?: string
  project: Project
}) {
  const destination = getPlaygroundShowcaseHref(project)
  if (destination.external) {
    return (
      <a className={className} href={destination.href} rel="noopener noreferrer" target="_blank">
        {children}
      </a>
    )
  }

  return (
    <Link className={className} href={destination.href}>
      {children}
    </Link>
  )
}

function OrbitCard({
  baseAngle,
  caption,
  cardSize,
  orbitRadius,
  priorityImage,
  project,
  rotation,
  onHoverEnd,
  onHoverStart,
}: {
  baseAngle: number
  caption: string
  cardSize: number
  orbitRadius: number
  priorityImage: boolean
  project: Project
  rotation: MotionValue<number>
  onHoverEnd: () => void
  onHoverStart: () => void
}) {
  const frame = useTransform(rotation, (value) => getPlaygroundOrbitCardFrame({ baseAngle, orbitRadius, rotation: value }))
  const x = useTransform(frame, (value) => value.x)
  const y = useTransform(frame, (value) => value.y)
  const scale = useTransform(frame, (value) => value.scale)
  const depthZ = useTransform(frame, (value) => value.zIndex)

  return (
    <m.div
      className="playground-showcase-orbit-card"
      style={{
        marginLeft: -cardSize / 2,
        marginTop: -cardSize / 2,
        scale,
        width: cardSize,
        x,
        y,
        zIndex: getPlaygroundOrbitCardZIndex(false, depthZ),
      }}
      onMouseEnter={onHoverStart}
      onMouseLeave={onHoverEnd}
      onFocus={onHoverStart}
      onBlur={onHoverEnd}
    >
      <ExperimentLink className="playground-showcase-thumb-link" project={project}>
        <span className="playground-showcase-thumb">
          <Image alt="" fill priority={priorityImage} sizes="120px" src={project.frontmatter.image} />
        </span>
        <span className="sr-only">{caption}</span>
      </ExperimentLink>
    </m.div>
  )
}

export default function PlaygroundShowcase({ className, projects }: PlaygroundShowcaseProps) {
  const [theme, setTheme] = useState<ShowcaseTheme>('light')
  const [mounted, setMounted] = useState(false)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const [orbitActive, setOrbitActive] = useState(false)
  const prefersReducedMotion = useReducedMotion() ?? false
  const orbitState = getPlaygroundOrbitViewState(projects, hoveredIndex)
  const rotation = useMotionValue(0)
  const speedRef = useRef(0)
  const orbitRadius = useOrbitRadius(PLAYGROUND_ORBIT_RADIUS_DESKTOP, PLAYGROUND_ORBIT_RADIUS_LARGE)

  const chooseTheme = useCallback((next: ShowcaseTheme) => {
    writeShowcaseThemePreference(next)
    applyPlaygroundShowcaseTheme(next)
    setTheme(next)
  }, [])

  useLayoutEffect(() => {
    const scheme = window.matchMedia('(prefers-color-scheme: dark)')
    const sync = () => {
      const next = resolveShowcaseTheme(readShowcaseThemePreference(), scheme.matches)
      applyPlaygroundShowcaseTheme(next)
      setTheme(next)
    }

    sync()
    scheme.addEventListener('change', sync)
    return () => {
      scheme.removeEventListener('change', sync)
      clearPlaygroundShowcaseTheme()
    }
  }, [])

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const timer = schedulePlaygroundOrbitActivation({
      projectCount: orbitState.count,
      scheduleActivation: (delayMs) => window.setTimeout(() => setOrbitActive(true), delayMs),
      timing: PLAYGROUND_ORBIT_ENTRANCE,
    })

    return () => window.clearTimeout(timer)
  }, [orbitState.count])

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
    if (nextOrbit.rotation !== rotation.get()) rotation.set(nextOrbit.rotation)
  })

  const activeProject = orbitState.activeHub
    ? projects.find((project) => project.slug === orbitState.activeHub?.contentKey) ?? null
    : null
  const activeCaption = orbitState.activeHub ? formatPlaygroundShowcaseCaption(orbitState.activeHub.meta) : ''
  const activeExternal = activeProject ? getPlaygroundShowcaseHref(activeProject).external : false

  return (
    <div className={className ? `playground-showcase ${className}` : 'playground-showcase'}>
      <header className="playground-showcase-bar">
        <Link href="/">{siteConfig.personName}</Link>
        <div className="playground-showcase-tools">
          <Link href="/">Back</Link>
          <div className="playground-showcase-theme" role="group" aria-label="Color theme">
            <button type="button" aria-pressed={theme === 'light'} onClick={() => chooseTheme('light')}>
              Light
            </button>
            <span aria-hidden="true">/</span>
            <button type="button" aria-pressed={theme === 'dark'} onClick={() => chooseTheme('dark')}>
              Dark
            </button>
          </div>
        </div>
      </header>

      <h1>Playground</h1>

      {projects.length === 0 ? (
        <p>{PLAYGROUND_EMPTY_COPY}</p>
      ) : (
        <>
          <section
            aria-label="Playground experiments"
            className="playground-showcase-orbit"
            onMouseLeave={() => setHoveredIndex(null)}
            style={{ ['--orbit-radius' as string]: `${orbitRadius}px` }}
          >
            <div aria-hidden="true" className="playground-showcase-ring" />
            <div className="playground-showcase-center">
              {activeProject ? (
                <ExperimentLink className="playground-showcase-caption" project={activeProject}>
                  {activeCaption}
                  {activeExternal ? <> <TextArrow /></> : null}
                </ExperimentLink>
              ) : null}
            </div>
            {mounted
              ? orbitState.cardStates.map((card) => (
                  <OrbitCard
                    key={card.project.slug}
                    baseAngle={card.baseAngle}
                    caption={formatPlaygroundShowcaseCaption(card.meta)}
                    cardSize={orbitState.cardSize}
                    orbitRadius={orbitRadius}
                    priorityImage={card.priorityImage}
                    project={card.project}
                    rotation={rotation}
                    onHoverEnd={() => setHoveredIndex(null)}
                    onHoverStart={() => setHoveredIndex(card.index)}
                  />
                ))
              : null}
          </section>

          <ul className="playground-showcase-list">
            {orbitState.cardStates.map((card) => {
              const external = getPlaygroundShowcaseHref(card.project).external
              return (
                <li key={card.project.slug}>
                  <ExperimentLink className="playground-showcase-row" project={card.project}>
                    <span className="playground-showcase-thumb">
                      <Image
                        alt=""
                        fill
                        priority={card.priorityImage}
                        sizes="72px"
                        src={card.project.frontmatter.image}
                      />
                    </span>
                    <span>
                      {formatPlaygroundShowcaseCaption(card.meta)}
                      {external ? <> <TextArrow /></> : null}
                    </span>
                  </ExperimentLink>
                </li>
              )
            })}
          </ul>
        </>
      )}
    </div>
  )
}
