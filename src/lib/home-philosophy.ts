import { HOME_SECTION_TITLE_CLASS_NAME } from './home-section.ts'

export const HOME_PHILOSOPHY_TITLE = 'How I build'
export const HOME_PHILOSOPHY_TITLE_CLASS_NAME = HOME_SECTION_TITLE_CLASS_NAME
export const HOME_PHILOSOPHY_BODY_CLASS_NAME =
  'text-pretty font-header text-[14px] font-normal leading-[1.5] tracking-[-0.012em] text-foreground'
export const HOME_PHILOSOPHY_MAX_SENTENCES = 4

export function getHomePhilosophySentences(body: string): string[] {
  return body
    .split(/(?<=\.)\s+/)
    .map((sentence) => sentence.trim())
    .filter(Boolean)
}

export function isHomePhilosophyBrief(body: string) {
  const sentences = getHomePhilosophySentences(body)

  return sentences.length >= 2 && sentences.length <= HOME_PHILOSOPHY_MAX_SENTENCES
}
