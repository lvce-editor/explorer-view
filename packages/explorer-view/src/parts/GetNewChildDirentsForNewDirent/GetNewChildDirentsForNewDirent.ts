import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { isExcluded } from '../IsExcluded/IsExcluded.ts'
import { join2 } from '../Path/Path.ts'

export const getNewChildDirentsForNewDirent = async (
  items: readonly ExplorerItem[],
  depth: number,
  parentPath: string,
  direntType: number,
  excluded: readonly string[] = [],
  root: string = parentPath,
  applicationId?: string,
): Promise<readonly ExplorerItem[]> => {
  // Get existing children or query them if they don't exist
  let existingChildren = items.filter((item) => item.depth === depth && item.uri.startsWith(parentPath))
  if (existingChildren.length === 0) {
    const childDirents = await FileSystem.readDirWithFileTypes(parentPath, applicationId)
    const visibleChildDirents = childDirents.filter((dirent: { name: string }) => !isExcluded(root, join2(parentPath, dirent.name), excluded))
    existingChildren = visibleChildDirents.map((dirent: { name: string; type: number }, index: number) => ({
      depth,
      name: dirent.name,
      posInSet: index + 1,
      selected: false,
      setSize: visibleChildDirents.length,
      type: dirent.type,
      uri: join2(parentPath, dirent.name),
    }))
  }
  const updatedChildren = existingChildren.map((child, index) => ({
    ...child,
    posInSet: index + 1,
    setSize: existingChildren.length + 2,
  }))
  const newDirent: ExplorerItem = {
    depth,
    name: '',
    posInSet: updatedChildren.length + 1,
    selected: false,
    setSize: existingChildren.length + 2,
    type: direntType,
    uri: parentPath,
  }
  const allChildDirents = [...updatedChildren, newDirent]
  return allChildDirents
}
