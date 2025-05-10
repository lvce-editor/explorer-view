import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const updateTree = (
  tree: Record<string, readonly ExplorerItem[]>,
  path: string,
  newDirents: readonly ExplorerItem[],
  oldAbsolutePath: string,
): Record<string, readonly ExplorerItem[]> => {
  const updatedTree = Object.create(null)
  updatedTree[path] = newDirents

  const pathWithSlash = `${path}/`

  for (const [key, value] of Object.entries(tree)) {
    console.log({ key, value })
    if (key === path) {
      // console.log('is eq')
    } else if (key.startsWith(pathWithSlash)) {
      console.log('starts wth', key, pathWithSlash)
      // const actual = key.slice(pathWithSlash.length)
    } else {
      // console.log('else', key, path, value)
      updatedTree[key] = value
    }
  }

  return updatedTree
}
