export const dirname = (pathSeparator: string, path: string): string => {
  const index = path.lastIndexOf(pathSeparator)
  if (index === -1) {
    return path
  }
  return path.slice(0, index)
}

export const getBaseName = (pathSeparator: string, path: string): string => {
  return path.slice(path.lastIndexOf(pathSeparator) + 1)
}
