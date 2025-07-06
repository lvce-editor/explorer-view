export const getDragLabel = (urls: readonly string[]): string => {
  if (urls.length === 1) {
    return urls[0]
  }
  return `${urls.length}`
}
