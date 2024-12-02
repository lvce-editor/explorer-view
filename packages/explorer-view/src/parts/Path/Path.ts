export const dirname = (pathSeparator: string, path: string): string => {
  const index = path.lastIndexOf(pathSeparator)
  if (index === -1) {
    return path
  }
  return path.slice(0, index)
}

export const join = (pathSeparator: string, ...parts: string[]): string => {
  return parts.join(pathSeparator)
}
