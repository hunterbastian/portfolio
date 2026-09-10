import type { BackgroundBeat } from '@/content/homepage'

export interface HomeBackgroundDisplayItem {
  description: string
  eyebrow: string
  key: string
  title: string
}

export function getHomeBackgroundKey(item: Pick<BackgroundBeat, 'title' | 'year'>) {
  return `${item.title}-${item.year}`
}

export function getHomeBackgroundSortYear(year: string) {
  const match = year.match(/\d{4}/)
  return match ? Number(match[0]) : 0
}

export function areBackgroundBeatsNewestFirst(items: readonly Pick<BackgroundBeat, 'year'>[]) {
  return items.every((item, index) => {
    if (index === 0) {
      return true
    }

    const previous = items[index - 1]
    if (!previous) {
      return true
    }

    return getHomeBackgroundSortYear(previous.year) >= getHomeBackgroundSortYear(item.year)
  })
}

export function getHomeBackgroundDisplayItem(item: BackgroundBeat): HomeBackgroundDisplayItem {
  return {
    description: item.description,
    eyebrow: item.year,
    key: getHomeBackgroundKey(item),
    title: item.title,
  }
}
