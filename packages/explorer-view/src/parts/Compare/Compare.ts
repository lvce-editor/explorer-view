const RE_CHARACTERS = /^[a-zA-Z.-]+$/

export const compareString = (a: string, b: string): number => {
  return a.localeCompare(b)
}

export const compareStringNumeric = (a: string, b: string): number => {
  if (RE_CHARACTERS.test(a) && RE_CHARACTERS.test(b)) {
    return a < b ? -1 : 1
  }
  return a.localeCompare(b, 'en', { numeric: true })
}
