'use client'

import { useDialKit } from 'dialkit'
import { useEffect, useMemo, useState } from 'react'

type ThemePreset = 'system' | 'light' | 'dusk' | 'night'

interface ThemeTone {
  background: string
  foreground: string
  card: string
  cardForeground: string
  primary: string
  primaryForeground: string
  secondary: string
  secondaryForeground: string
  muted: string
  mutedForeground: string
  accent: string
  accentForeground: string
  border: string
  input: string
  ring: string
  ambientAqua: number
  ambientBlue: number
  gridOpacity: number
  gridLineAlpha: number
  cardLift: number
  cardBase: number
  buttonBase: number
  selectionOpacity: number
}

const LIGHT_TONE: ThemeTone = {
  background: '#dce2eb',
  foreground: '#2e3440',
  card: '#e4eaf2',
  cardForeground: '#2e3440',
  primary: '#6689b2',
  primaryForeground: '#edf2f7',
  secondary: '#ccd5e2',
  secondaryForeground: '#2e3440',
  muted: '#c5cfdd',
  mutedForeground: '#4c566a',
  accent: '#8aaacc',
  accentForeground: '#2e3440',
  border: '#b4c0d0',
  input: '#b4c0d0',
  ring: '#6689b2',
  ambientAqua: 0.11,
  ambientBlue: 0.08,
  gridOpacity: 0.34,
  gridLineAlpha: 0.1,
  cardLift: 10,
  cardBase: 90,
  buttonBase: 86,
  selectionOpacity: 0.28,
}

const DUSK_TONE: ThemeTone = {
  background: '#3a4455',
  foreground: '#e6edf7',
  card: '#475365',
  cardForeground: '#edf2fa',
  primary: '#95bfd8',
  primaryForeground: '#2a3240',
  secondary: '#536074',
  secondaryForeground: '#e6edf7',
  muted: '#516075',
  mutedForeground: '#ced7e5',
  accent: '#88accb',
  accentForeground: '#e6edf7',
  border: '#647185',
  input: '#647185',
  ring: '#95bfd8',
  ambientAqua: 0.17,
  ambientBlue: 0.13,
  gridOpacity: 0.42,
  gridLineAlpha: 0.16,
  cardLift: 4,
  cardBase: 96,
  buttonBase: 94,
  selectionOpacity: 0.28,
}

const NIGHT_TONE: ThemeTone = {
  background: '#2a3140',
  foreground: '#e5e9f0',
  card: '#343d4f',
  cardForeground: '#eaf0f8',
  primary: '#8dc2d2',
  primaryForeground: '#263041',
  secondary: '#40495c',
  secondaryForeground: '#e5e9f0',
  muted: '#3d4659',
  mutedForeground: '#d3dbe8',
  accent: '#84a8c7',
  accentForeground: '#e5e9f0',
  border: '#4f5a6e',
  input: '#4f5a6e',
  ring: '#8dc2d2',
  ambientAqua: 0.2,
  ambientBlue: 0.15,
  gridOpacity: 0.46,
  gridLineAlpha: 0.2,
  cardLift: 3,
  cardBase: 97,
  buttonBase: 95,
  selectionOpacity: 0.28,
}

const THEME_OVERRIDE_PROPERTIES = [
  '--background',
  '--foreground',
  '--background-rgb',
  '--card',
  '--card-foreground',
  '--primary',
  '--primary-foreground',
  '--secondary',
  '--secondary-foreground',
  '--muted',
  '--muted-foreground',
  '--accent',
  '--accent-foreground',
  '--border',
  '--input',
  '--ring',
  '--theme-ambient-aqua',
  '--theme-ambient-blue',
  '--theme-grid-opacity',
  '--theme-grid-line-alpha',
  '--theme-grid-size',
  '--theme-card-lift',
  '--theme-card-base',
  '--theme-button-base',
  '--theme-selection-opacity',
] as const

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value))
}

function normalizeHex(hexColor: string): string {
  const value = hexColor.trim().replace('#', '')
  if (value.length === 3) {
    return value
      .split('')
      .map((segment) => `${segment}${segment}`)
      .join('')
  }
  return value
}

function hexToRgb(hexColor: string): [number, number, number] {
  const normalized = normalizeHex(hexColor)
  if (!/^[\da-fA-F]{6}$/.test(normalized)) {
    return [0, 0, 0]
  }

  const parsed = Number.parseInt(normalized, 16)
  return [(parsed >> 16) & 255, (parsed >> 8) & 255, parsed & 255]
}

function rgbToHex(red: number, green: number, blue: number): string {
  const clampChannel = (channel: number) => clamp(Math.round(channel), 0, 255)
  return `#${[clampChannel(red), clampChannel(green), clampChannel(blue)]
    .map((channel) => channel.toString(16).padStart(2, '0'))
    .join('')}`
}

function mixHex(fromHex: string, toHex: string, amount: number): string {
  const [fromRed, fromGreen, fromBlue] = hexToRgb(fromHex)
  const [toRed, toGreen, toBlue] = hexToRgb(toHex)
  const mixAmount = clamp(amount, 0, 1)

  return rgbToHex(
    fromRed + (toRed - fromRed) * mixAmount,
    fromGreen + (toGreen - fromGreen) * mixAmount,
    fromBlue + (toBlue - fromBlue) * mixAmount
  )
}

function tuneForeground(baseHex: string, darkness: number, contrast: number): string {
  const towardWhite = clamp(darkness * 0.38 + Math.max(contrast, 0), 0, 0.58)
  const towardBlack = clamp(Math.max(-contrast, 0), 0, 0.34)
  const brightened = mixHex(baseHex, '#ffffff', towardWhite)
  return mixHex(brightened, '#000000', towardBlack)
}

function getToneByPreset(preset: ThemePreset, systemDark: boolean): ThemeTone {
  if (preset === 'light') {
    return LIGHT_TONE
  }
  if (preset === 'dusk') {
    return DUSK_TONE
  }
  if (preset === 'night') {
    return NIGHT_TONE
  }
  return systemDark ? NIGHT_TONE : LIGHT_TONE
}

export default function ThemeSurfaceDial() {
  const [systemDark, setSystemDark] = useState(false)

  const themeSurfaceDial = useDialKit('Theme Surface Lab', {
    tone: {
      preset: {
        type: 'select',
        options: [
          { value: 'dusk', label: 'Dusk (Recommended)' },
          { value: 'system', label: 'System' },
          { value: 'light', label: 'Light' },
          { value: 'night', label: 'Night' },
        ],
        default: 'dusk',
      },
    },
    balance: {
      darkness: [0.08, 0, 0.34],
      contrast: [0, -0.2, 0.2],
    },
    atmosphere: {
      ambientAqua: [1, 0, 1.8],
      ambientBlue: [1, 0, 1.8],
      gridOpacity: [1, 0.2, 1.8],
      gridLineAlpha: [1, 0.2, 1.8],
      gridSize: [44, 28, 72],
    },
    surface: {
      liftScale: [1, 0.45, 1.8],
      cardBaseScale: [1, 0.9, 1.08],
      buttonBaseScale: [1, 0.9, 1.08],
    },
    accent: {
      selectionOpacity: [1, 0.35, 1.8],
    },
  })

  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
    const syncDarkPreference = () => setSystemDark(mediaQuery.matches)
    syncDarkPreference()

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', syncDarkPreference)
      return () => mediaQuery.removeEventListener('change', syncDarkPreference)
    }

    mediaQuery.addListener(syncDarkPreference)
    return () => mediaQuery.removeListener(syncDarkPreference)
  }, [])

  const tone = useMemo(
    () => getToneByPreset(themeSurfaceDial.tone.preset as ThemePreset, systemDark),
    [systemDark, themeSurfaceDial.tone.preset]
  )

  useEffect(() => {
    const root = document.documentElement
    const preset = themeSurfaceDial.tone.preset as ThemePreset
    const darkness = clamp(themeSurfaceDial.balance.darkness, 0, 0.34)
    const contrast = clamp(themeSurfaceDial.balance.contrast, -0.2, 0.2)

    if (preset === 'system') {
      root.removeAttribute('data-theme-tone')
    } else {
      root.setAttribute('data-theme-tone', preset === 'light' ? 'light' : preset)
    }

    const background = mixHex(tone.background, '#000000', darkness)
    const foreground = tuneForeground(tone.foreground, darkness, contrast)
    const card = mixHex(tone.card, '#000000', darkness * 0.74)
    const secondary = mixHex(tone.secondary, '#000000', darkness * 0.62)
    const muted = mixHex(tone.muted, '#000000', darkness * 0.64)
    const border = mixHex(tone.border, '#000000', darkness * 0.66)
    const primary = mixHex(tone.primary, '#000000', darkness * 0.22)
    const accent = mixHex(tone.accent, '#000000', darkness * 0.16)
    const input = border
    const ring = primary
    const cardForeground = tuneForeground(tone.cardForeground, darkness, contrast * 0.9)
    const secondaryForeground = tuneForeground(tone.secondaryForeground, darkness, contrast * 0.9)
    const mutedForeground = tuneForeground(tone.mutedForeground, darkness * 0.7, contrast * 0.75)
    const accentForeground = tuneForeground(tone.accentForeground, darkness, contrast * 0.85)

    const [bgRed, bgGreen, bgBlue] = hexToRgb(background)

    root.style.setProperty('--background', background)
    root.style.setProperty('--foreground', foreground)
    root.style.setProperty('--background-rgb', `${bgRed}, ${bgGreen}, ${bgBlue}`)
    root.style.setProperty('--card', card)
    root.style.setProperty('--card-foreground', cardForeground)
    root.style.setProperty('--primary', primary)
    root.style.setProperty('--primary-foreground', tone.primaryForeground)
    root.style.setProperty('--secondary', secondary)
    root.style.setProperty('--secondary-foreground', secondaryForeground)
    root.style.setProperty('--muted', muted)
    root.style.setProperty('--muted-foreground', mutedForeground)
    root.style.setProperty('--accent', accent)
    root.style.setProperty('--accent-foreground', accentForeground)
    root.style.setProperty('--border', border)
    root.style.setProperty('--input', input)
    root.style.setProperty('--ring', ring)
    root.style.setProperty(
      '--theme-ambient-aqua',
      clamp(tone.ambientAqua * themeSurfaceDial.atmosphere.ambientAqua, 0, 0.5).toFixed(3)
    )
    root.style.setProperty(
      '--theme-ambient-blue',
      clamp(tone.ambientBlue * themeSurfaceDial.atmosphere.ambientBlue, 0, 0.5).toFixed(3)
    )
    root.style.setProperty(
      '--theme-grid-opacity',
      clamp(tone.gridOpacity * themeSurfaceDial.atmosphere.gridOpacity, 0.05, 0.85).toFixed(3)
    )
    root.style.setProperty(
      '--theme-grid-line-alpha',
      clamp(tone.gridLineAlpha * themeSurfaceDial.atmosphere.gridLineAlpha, 0.02, 0.45).toFixed(3)
    )
    root.style.setProperty('--theme-grid-size', `${Math.round(themeSurfaceDial.atmosphere.gridSize)}px`)
    root.style.setProperty(
      '--theme-card-lift',
      `${clamp(tone.cardLift * themeSurfaceDial.surface.liftScale, 1, 18).toFixed(2)}%`
    )
    root.style.setProperty(
      '--theme-card-base',
      `${clamp(tone.cardBase * themeSurfaceDial.surface.cardBaseScale, 82, 99).toFixed(2)}%`
    )
    root.style.setProperty(
      '--theme-button-base',
      `${clamp(tone.buttonBase * themeSurfaceDial.surface.buttonBaseScale, 80, 99).toFixed(2)}%`
    )
    root.style.setProperty(
      '--theme-selection-opacity',
      clamp(tone.selectionOpacity * themeSurfaceDial.accent.selectionOpacity, 0.1, 0.56).toFixed(3)
    )
  }, [
    systemDark,
    themeSurfaceDial.accent.selectionOpacity,
    themeSurfaceDial.atmosphere.ambientAqua,
    themeSurfaceDial.atmosphere.ambientBlue,
    themeSurfaceDial.atmosphere.gridLineAlpha,
    themeSurfaceDial.atmosphere.gridOpacity,
    themeSurfaceDial.atmosphere.gridSize,
    themeSurfaceDial.balance.contrast,
    themeSurfaceDial.balance.darkness,
    themeSurfaceDial.surface.buttonBaseScale,
    themeSurfaceDial.surface.cardBaseScale,
    themeSurfaceDial.surface.liftScale,
    themeSurfaceDial.tone.preset,
    tone,
  ])

  useEffect(() => {
    return () => {
      const root = document.documentElement
      root.removeAttribute('data-theme-tone')
      for (const property of THEME_OVERRIDE_PROPERTIES) {
        root.style.removeProperty(property)
      }
    }
  }, [])

  return null
}
