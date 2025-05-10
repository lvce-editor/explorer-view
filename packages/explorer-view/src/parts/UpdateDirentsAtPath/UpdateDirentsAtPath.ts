import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import { join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'

export const updateDirentsAtPath = (
  items: readonly ExplorerItem[],
  path: string,
  root: string,
  newDirents: readonly RawDirent[],
): readonly ExplorerItem[] => {
  const sortedDirents = newDirents
    .map((dirent, index) => ({
      name: dirent.name,
      type: dirent.type,
      path: join2(path, dirent.name),
      depth: 0, // TODO
      selected: false,
      posInSet: index + 1,
      setSize: newDirents.length,
      icon: '',
    }))
    .sort(CompareDirent.compareDirent)

  const tree = createTree(items, root)
  const updatedTree = {
    ...tree,
    [path]: sortedDirents,
  }
  const newItems = treeToArray(updatedTree, root)
  return newItems
}
