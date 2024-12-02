export const getPathParts = (root: string, uri: string, pathSeparator: string): any[] => {
  const parts = []
  let index = root.length - 1
  let depth = 0
  while ((index = uri.indexOf('/', index + 1)) !== -1) {
    const partUri = uri.slice(0, index)
    parts.push({
      path: partUri,
      depth: depth++,
      root,
      pathSeparator,
    })
  }
  return parts
}
