export const isEqual = (a: any, b: any): boolean => {
  if (a.length !== b.length) {
    return false
  }
  const { length } = a
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}
