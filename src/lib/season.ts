export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter'

export function getSeason(): Season {
  const month = new Date().getMonth()
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
