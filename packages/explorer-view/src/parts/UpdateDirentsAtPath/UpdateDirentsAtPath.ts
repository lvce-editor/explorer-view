import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { createTree } from '../CreateRenameMap/CreateRenameMap.ts'
import { join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'
import { updateTree } from '../UpdateTree/UpdateTree.ts'

export const updateDirentsAtPath = (
  items: readonly ExplorerItem[],
  path: string,
  root: string,
  newDirents: readonly RawDirent[],
  oldAbsolutePath: string,
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

  const tree = createTree(items)
  const updatedTree = updateTree(tree, path, sortedDirents)
  const newItems = treeToArray(updatedTree, root)
  return newItems
}
