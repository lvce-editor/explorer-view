export const ensureUris = (maybeUris: readonly string[]): readonly string[] => {
  const uris: string[] = []
  for (const item of maybeUris) {
    if (item.startsWith('/')) {
      uris.push(`file://` + item)
    } else {
      uris.push(item)
    }
  }
  return uris
}
