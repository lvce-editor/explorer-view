import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { join2 } from '../Path/Path.ts'

export const getNewChildDirentsForNewDirent = async (
  items: readonly ExplorerItem[],
  depth: number,
  parentPath: string,
  direntType: number,
): Promise<readonly ExplorerItem[]> => {
  // Get existing children or query them if they don't exist
  let existingChildren = items.filter((item) => item.depth === depth && item.path.startsWith(parentPath))
  if (existingChildren.length === 0) {
    const childDirents = await FileSystem.readDirWithFileTypes(parentPath)
    existingChildren = childDirents.map((dirent: { name: string; type: number }, index: number) => ({
      name: dirent.name,
      type: dirent.type,
      path: join2(parentPath, dirent.name),
      depth,
      selected: false,
      posInSet: index + 1,
      setSize: childDirents.length,
      icon: '',
    }))
  }
  const updatedChildren = existingChildren.map((child, index) => ({
    ...child,
    posInSet: index + 1,
    setSize: existingChildren.length + 2,
  }))
  const newDirent: ExplorerItem = {
    name: '',
    type: direntType,
    path: parentPath,
    depth,
    selected: false,
    posInSet: updatedChildren.length + 1,
    setSize: existingChildren.length + 2,
    icon: '',
  }
  const allChildDirents = [...updatedChildren, newDirent]
  return allChildDirents
}
