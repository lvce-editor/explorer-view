import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { createTree } from '../CreateRenameMap/CreateRenameMap.ts'
import { dirname, join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'
import { updateTree } from '../UpdateTree/UpdateTree.ts'
import { renameDirentsPath } from '../RenameDirentsPath/RenameDirentsPath.ts'

export const updateDirentsAtPath = (
  items: readonly ExplorerItem[],
  root: string,
  insertedDirents: readonly RawDirent[],
  oldAbsolutePath: string,
  newAbsolutePath: string,
): readonly ExplorerItem[] => {
  const newItems1 = renameDirentsPath(items, oldAbsolutePath, newAbsolutePath)
  const parentPath = dirname('/', newAbsolutePath)
  const sortedDirents = insertedDirents
    .map((dirent, index) => ({
      name: dirent.name,
      type: dirent.type,
      path: join2(parentPath, dirent.name),
      depth: 0, // TODO
      selected: false,
      posInSet: index + 1,
      setSize: insertedDirents.length,
      icon: '',
    }))
    .sort(CompareDirent.compareDirent)

  const tree = createTree(newItems1)
  const updatedTree = {
    ...tree,
    [parentPath]: sortedDirents,
  }
  const newItems = treeToArray(updatedTree, root)
  return newItems
}
