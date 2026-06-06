export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

export interface SeasonalAccentTarget {
  style: {
    setProperty: (name: string, value: string) => void
  }
}

export function getSeason(date = new Date()): Season {
  const month = date.getMonth()
  if (month >= 2 && month <= 4) return 'Spring'
  if (month >= 5 && month <= 7) return 'Summer'
  if (month >= 8 && month <= 10) return 'Autumn'
  return 'Winter'
}

export const SEASON_ACCENT: Record<Season, string> = {
  Spring: '#da8a82',
  Summer: '#c99a5b',
  Autumn: '#b57a5d',
  Winter: '#7a8b96',
}

export function getSeasonAccent(season = getSeason()): string {
  return SEASON_ACCENT[season]
}

export function applySeasonalAccent(target: SeasonalAccentTarget, season = getSeason()): string {
  const accent = getSeasonAccent(season)

  target.style.setProperty('--accent', accent)
  target.style.setProperty('--ring', accent)

  return accent
}
