const defaultIndent = 1

export const getTreeItemIndent = (depth: number): string => {
  return `${depth * defaultIndent}rem`
}
