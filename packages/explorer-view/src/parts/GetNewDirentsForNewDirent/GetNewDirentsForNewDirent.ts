import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { invoke } from '../ParentRpc/ParentRpc.ts'

export const getNewDirentsForNewDirent = async (
  items: readonly ExplorerItem[],
  focusedIndex: number,
  type: number,
): Promise<readonly ExplorerItem[]> => {
  const focusedItem = items[focusedIndex]
  if (!focusedItem) {
    return items
  }
  const parentPath = focusedItem.path
  const depth = focusedItem.depth + 1

  // Get existing children or query them if they don't exist
  let existingChildren = items.filter((item) => item.depth === depth && item.path.startsWith(parentPath))
  if (existingChildren.length === 0) {
    const childDirents = await invoke('FileSystem.readDirWithFileTypes', parentPath)
    existingChildren = childDirents.map((dirent: { name: string; type: number }, index: number) => ({
      name: dirent.name,
      type: dirent.type,
      path: `${parentPath}/${dirent.name}`,
      depth,
      selected: false,
      posInSet: index + 1,
      setSize: childDirents.length,
      icon: '',
    }))
  }

  const newDirent: ExplorerItem = {
    name: '',
    type,
    path: '',
    depth,
    selected: false,
    posInSet: existingChildren.length + 1,
    setSize: existingChildren.length + 1,
    icon: '',
  }

  // Create new array with updated items
  const parentIndex = focusedIndex
  const itemsBeforeParent = items.slice(0, parentIndex)
  const itemsAfterChildren = items.slice(parentIndex + 1 + existingChildren.length)

  const updatedParent = {
    ...items[parentIndex],
    setSize: (items[parentIndex]?.setSize || 0) + 1,
  }

  const updatedChildren = existingChildren.map((child, index) => ({
    ...child,
    posInSet: index + 1,
    setSize: existingChildren.length + 1,
  }))

  return [...itemsBeforeParent, updatedParent, ...updatedChildren, newDirent, ...itemsAfterChildren]
}
