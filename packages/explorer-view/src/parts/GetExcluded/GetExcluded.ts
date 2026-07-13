export const getExcluded = (excludedObject: unknown): string[] => {
  if (!excludedObject || typeof excludedObject !== 'object' || Array.isArray(excludedObject)) {
    return []
  }
  const excluded: string[] = []
  for (const [key, value] of Object.entries(excludedObject)) {
    if (value === true) {
      excluded.push(key)
    }
  }
  return excluded
}
