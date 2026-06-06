export function formatYearFromDate(date: string, fallback = 'Now'): string {
  const explicitYear = date.trim().match(/^(\d{4})/)

  if (explicitYear) {
    return explicitYear[1]
  }

  const parsedYear = new Date(date).getFullYear()
  return Number.isFinite(parsedYear) ? `${parsedYear}` : fallback
}
