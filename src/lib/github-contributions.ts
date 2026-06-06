export interface ContributionDate {
  date: string
}

export const GITHUB_CONTRIBUTION_MONTHS = 5
export const GITHUB_CONTRIBUTION_USERNAME = 'hunterbastian'

export const GITHUB_CONTRIBUTION_CALENDAR_CONFIG = {
  showColorLegend: false,
  showTotalCount: false,
  blockSize: 10,
  blockMargin: 3,
  blockRadius: 0,
  fontSize: 10,
} as const

export const GITHUB_CONTRIBUTION_THEME: { light: string[]; dark: string[] } = {
  light: ['#e5e5e5', '#c0c0c0', '#8a8a8a', '#555555', '#222222'],
  dark: ['#2a2a2a', '#444444', '#666666', '#999999', '#cccccc'],
}

export function getContributionCutoffDate(months: number, now = new Date()): string {
  const cutoff = new Date(now)
  cutoff.setMonth(cutoff.getMonth() - months)

  return cutoff.toISOString().slice(0, 10)
}

export function selectRecentContributionMonths<TContribution extends ContributionDate>(
  data: TContribution[],
  months = GITHUB_CONTRIBUTION_MONTHS,
  now = new Date(),
): TContribution[] {
  const cutoffDate = getContributionCutoffDate(months, now)

  return data.filter((contribution) => contribution.date >= cutoffDate)
}
