export interface AnimatedDigitPart {
  character: string
  key: string
  stagger?: 1 | 2
}

export interface AnimatedDigitPartsOptions {
  staggerLastNumericCount?: 0 | 1 | 2
}

export function getAnimatedDigitParts(
  text: string,
  { staggerLastNumericCount = 2 }: AnimatedDigitPartsOptions = {},
): AnimatedDigitPart[] {
  const characters = [...text]
  const numericIndexes = characters
    .map((character, index) => (/\d/.test(character) ? index : -1))
    .filter((index) => index >= 0)
  const staggeredIndexes =
    staggerLastNumericCount === 0 ? [] : numericIndexes.slice(-staggerLastNumericCount)

  return characters.map((character, index) => {
    const staggerPosition = staggeredIndexes.indexOf(index)

    return {
      character,
      key: `${index}-${character}`,
      ...(staggerPosition >= 0 ? { stagger: (staggerPosition + 1) as 1 | 2 } : {}),
    }
  })
}
