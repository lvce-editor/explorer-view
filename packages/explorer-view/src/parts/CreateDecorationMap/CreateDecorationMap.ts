export const createDecorationMap = (decorations: readonly any[]): Record<string, string> => {
  const map: Record<string, string> = Object.create(null)
  for (const decoration of decorations) {
    map[decoration.uri] = decoration.decoration
  }
  return map
}
