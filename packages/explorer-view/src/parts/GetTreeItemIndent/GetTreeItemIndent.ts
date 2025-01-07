const defaultIndent = 1

export const getTreeItemIndent = (depth: number): string => {
  // TODO logic should be in getVisibleItems
  return `${depth * defaultIndent}rem`
}
