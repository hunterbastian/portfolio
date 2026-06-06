import type { EducationItem, ExperienceItem } from '@/content/homepage'

export interface HomeExperienceDisplayItem {
  description: string
  eyebrow: string
  key: string
  title: string
}

export interface HomeEducationDisplayItem {
  description: string
  eyebrow: string
  key: string
  title: string
}

export function getHomeExperienceKey(item: Pick<ExperienceItem, 'company' | 'year'>) {
  return `${item.company}-${item.year}`
}

export function getHomeExperienceTitle(item: Pick<ExperienceItem, 'company' | 'title'>) {
  return `${item.title} — ${item.company}`
}

export function getHomeExperienceDisplayItem(item: ExperienceItem): HomeExperienceDisplayItem {
  return {
    description: item.description,
    eyebrow: item.year,
    key: getHomeExperienceKey(item),
    title: getHomeExperienceTitle(item),
  }
}

export function getHomeEducationKey(item: Pick<EducationItem, 'institution' | 'year'>) {
  return `${item.institution}-${item.year}`
}

export function getHomeEducationTitle(item: Pick<EducationItem, 'degree' | 'institution'>) {
  return `${item.degree} — ${item.institution}`
}

export function getHomeEducationDescription(item: Pick<EducationItem, 'level' | 'note'>) {
  return item.note ? `${item.level}. ${item.note}.` : item.level
}

export function getHomeEducationDisplayItem(item: EducationItem): HomeEducationDisplayItem {
  return {
    description: getHomeEducationDescription(item),
    eyebrow: item.year,
    key: getHomeEducationKey(item),
    title: getHomeEducationTitle(item),
  }
}
