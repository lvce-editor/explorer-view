import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getNewChildDirentsForNewDirent } from '../GetNewChildDirentsForNewDirent/GetNewChildDirentsForNewDirent.ts'
import { getParentEndIndex } from '../GetParentEndIndex/GetParentEndIndex.ts'

const folderTypes = new Set([DirentType.Directory, DirentType.DirectoryExpanded, DirentType.DirectoryExpanding, DirentType.SymLinkFolder])

const getTopLevelFileIndex = (items: readonly ExplorerItem[]): number => {
  const topLevelDepth = items[0]?.depth
  return items.findIndex((item) => item.depth === topLevelDepth && !folderTypes.has(item.type))
}

export const getNewDirentsForNewDirent = async (
  items: readonly ExplorerItem[],
  focusedIndex: number,
  type: number,
  root: string,
  excluded: readonly string[] = [],
  insertAtFolderBoundary = false,
): Promise<readonly ExplorerItem[]> => {
  if (items.length === 0 || focusedIndex === -1) {
    const newDirent: ExplorerItem = {
      depth: 0,
      icon: '',
      name: '',
      path: root,
      posInSet: 1,
      selected: false,
      setSize: 1,
      type,
    }
    if (type === DirentType.EditingFolder) {
      return [newDirent, ...items]
    }
    if (!insertAtFolderBoundary) {
      return [...items, newDirent]
    }
    const fileIndex = getTopLevelFileIndex(items)
    if (fileIndex === -1) {
      return [...items, newDirent]
    }
    return [...items.slice(0, fileIndex), newDirent, ...items.slice(fileIndex)]
  }

  const focusedItem = items[focusedIndex]
  if (!focusedItem) {
    return items
  }
  const parentPath = focusedItem.path
  const depth = focusedItem.depth + 1

  const updatedChildren = await getNewChildDirentsForNewDirent(items, depth, parentPath, type, excluded, root)

  // Create new array with updated items
  const parentIndex = focusedIndex
  const itemsBeforeParent = items.slice(0, parentIndex)
  const parentEndIndex = getParentEndIndex(items, parentIndex)
  const existingDescendants = items.slice(parentIndex + 1, parentEndIndex)
  let childIndex = 0
  for (let i = 0; i < existingDescendants.length; i++) {
    if (existingDescendants[i].depth === depth) {
      existingDescendants[i] = updatedChildren[childIndex++]
    }
  }
  const newChildren = existingDescendants.length === 0 ? updatedChildren : [...existingDescendants, updatedChildren.at(-1)!]
  const itemsAfterChildren = items.slice(parentEndIndex)

  let updatedParent = {
    ...items[parentIndex],
    setSize: (items[parentIndex]?.setSize || 0) + 1,
  }

  // If the parent is a closed Directory, expand it
  if (updatedParent.type === DirentType.Directory) {
    updatedParent = { ...updatedParent, type: DirentType.DirectoryExpanded }
  }

  return [...itemsBeforeParent, updatedParent, ...newChildren, ...itemsAfterChildren]
}
