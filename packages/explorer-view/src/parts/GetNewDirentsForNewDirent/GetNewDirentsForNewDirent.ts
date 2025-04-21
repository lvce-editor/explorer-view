import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { invoke } from '../ParentRpc/ParentRpc.ts'

export const getNewDirentsForNewDirent = async (state: ExplorerState, type: number): Promise<readonly ExplorerItem[]> => {
  const focusedItem = state.items[state.focusedIndex]
  if (!focusedItem) {
    return state.items
  }
  const parentPath = focusedItem.path
  const depth = focusedItem.depth + 1

  // Get existing children or query them if they don't exist
  let existingChildren = state.items.filter((item) => item.depth === depth && item.path.startsWith(parentPath))
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
  const parentIndex = state.focusedIndex
  const itemsBeforeParent = state.items.slice(0, parentIndex)
  const itemsAfterChildren = state.items.slice(parentIndex + 1 + existingChildren.length)

  const updatedParent = {
    ...state.items[parentIndex],
    setSize: (state.items[parentIndex]?.setSize || 0) + 1,
  }

  const updatedChildren = existingChildren.map((child, index) => ({
    ...child,
    posInSet: index + 1,
    setSize: existingChildren.length + 1,
  }))

  return [...itemsBeforeParent, updatedParent, ...updatedChildren, newDirent, ...itemsAfterChildren]
}
