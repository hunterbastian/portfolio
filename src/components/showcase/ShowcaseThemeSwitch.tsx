'use client'

import { useState } from 'react'
import { Switch } from '@/components/ui/switch'
import type { ShowcaseTheme } from '@/lib/home-showcase'

interface ShowcaseThemeSwitchProps {
  className?: string
  theme: ShowcaseTheme
  onChange: (theme: ShowcaseTheme) => void
}

export default function ShowcaseThemeSwitch({ className, theme, onChange }: ShowcaseThemeSwitchProps) {
  const dark = theme === 'dark'
  const [travel, setTravel] = useState<'to-dark' | 'to-light' | null>(null)

  return (
    <div
      className={className ? `showcase-theme-switch-row ${className}` : 'showcase-theme-switch-row'}
      role="group"
      aria-label="Color theme"
    >
      <span className="showcase-theme-label" aria-hidden="true">
        <span className="showcase-theme-label-mute">Light</span>
        <span className={dark ? 'showcase-theme-label-ink' : 'showcase-theme-label-ink is-current'} data-theme="light">Light</span>
      </span>
      <Switch
        size="sm"
        checked={dark}
        data-travel={travel ?? undefined}
        onCheckedChange={(checked) => {
          setTravel(checked ? 'to-dark' : 'to-light')
          onChange(checked ? 'dark' : 'light')
        }}
        aria-label="Dark theme"
      />
      <span className="showcase-theme-label" aria-hidden="true">
        <span className="showcase-theme-label-mute">Dark</span>
        <span className={dark ? 'showcase-theme-label-ink is-current' : 'showcase-theme-label-ink'} data-theme="dark">Dark</span>
      </span>
    </div>
  )
}
