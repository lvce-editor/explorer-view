import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { createTree } from '../CreateRenameMap/CreateRenameMap.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { join2 } from '../Path/Path.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'

export const updateDirentsAtPath = async (items: readonly ExplorerItem[], path: string, root: string): Promise<readonly ExplorerItem[]> => {
  const newDirents = await FileSystem.readDirWithFileTypes(path)

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

  const map = {
    ...createTree(items),
    [path]: sortedDirents,
  }

  const newItems = treeToArray(map, root)

  return newItems
}
