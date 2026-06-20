const RE_CHARACTERS = /^[a-zA-Z.-]+$/
const RE_DIGITS = /^\d+$/
const RE_PARTS = /\d+|\D+/g

const getParts = (value: string): readonly string[] => {
  return value.match(RE_PARTS) || []
}

const compareNumberParts = (a: string, b: string): number => {
  const normalizedA = a.replace(/^0+/, '') || '0'
  const normalizedB = b.replace(/^0+/, '') || '0'
  if (normalizedA.length !== normalizedB.length) {
    return normalizedA.length - normalizedB.length
  }
  if (normalizedA !== normalizedB) {
    return normalizedA < normalizedB ? -1 : 1
  }
  return a.length - b.length
}

const compareParts = (a: string, b: string): number => {
  if (RE_DIGITS.test(a) && RE_DIGITS.test(b)) {
    return compareNumberParts(a, b)
  }
  return a.localeCompare(b, 'en')
}

const compareNatural = (a: string, b: string): number => {
  const partsA = getParts(a)
  const partsB = getParts(b)
  const count = Math.min(partsA.length, partsB.length)
  for (let i = 0; i < count; i++) {
    const result = compareParts(partsA[i], partsB[i])
    if (result) {
      return result
    }
  }
  return partsA.length - partsB.length
}

export const compareStringNumeric = (a: string, b: string): number => {
  if (RE_CHARACTERS.test(a) && RE_CHARACTERS.test(b)) {
    return a < b ? -1 : 1
  }
  return compareNatural(a, b)
}
