import { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const getNewDirentsForNewDirent = async (state: ExplorerState, type: number): Promise<readonly ExplorerItem[]> => {
  const focusedItem = state.items[state.focusedIndex]
  if (!focusedItem) {
    return state.items
  }
  const parentPath = focusedItem.path
  const depth = focusedItem.depth + 1

  const existingChildren = state.items.filter((item) => item.depth === depth && item.path.startsWith(parentPath))

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

  const result = [...state.items]
  const insertIndex = state.focusedIndex + existingChildren.length + 1
  result.splice(insertIndex, 0, newDirent)

  // Update setSize for parent
  const parentIndex = state.focusedIndex
  if (parentIndex >= 0) {
    result[parentIndex] = {
      ...result[parentIndex],
      setSize: result[parentIndex]?.setSize || 0 + 1,
    }
  }

  // Update posInSet and setSize for existing children
  for (let i = state.focusedIndex + 1; i < result.length; i++) {
    const item = result[i]
    if (item.depth === depth && item.path.startsWith(parentPath)) {
      result[i] = {
        ...item,
        posInSet: item.posInSet,
        setSize: existingChildren.length + 1,
      }
    }
  }

  return result
}
