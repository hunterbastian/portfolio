export const HOME_PHILOSOPHY_TITLE = 'How I build'
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
