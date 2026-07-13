const RE_ASCII = /^[a-z]$/i

export const isAscii = (key: string): boolean => {
  return RE_ASCII.test(key)
}
