'use client'

import { Switch } from '@/components/ui/switch'
import type { ShowcaseTheme } from '@/lib/home-showcase'

interface ShowcaseThemeSwitchProps {
  className?: string
  theme: ShowcaseTheme
  onChange: (theme: ShowcaseTheme) => void
}

export default function ShowcaseThemeSwitch({ className, theme, onChange }: ShowcaseThemeSwitchProps) {
  const dark = theme === 'dark'

  return (
    <div
      className={className ? `showcase-theme-switch-row ${className}` : 'showcase-theme-switch-row'}
      role="group"
      aria-label="Color theme"
    >
      <span className={dark ? undefined : 'is-current'} aria-hidden="true">
        Light
      </span>
      <Switch
        size="sm"
        checked={dark}
        onCheckedChange={(checked) => onChange(checked ? 'dark' : 'light')}
        aria-label="Dark theme"
      />
      <span className={dark ? 'is-current' : undefined} aria-hidden="true">
        Dark
      </span>
    </div>
  )
}
