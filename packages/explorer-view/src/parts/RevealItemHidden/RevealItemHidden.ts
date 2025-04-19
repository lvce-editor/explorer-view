import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { getPathParts } from '../GetPathParts/GetPathParts.ts'
import { getPathPartsToReveal } from '../GetPathPartsToReveal/GetPathPartsToReveal.ts'
import { orderDirents } from '../OrderDirents/OrderDirents.ts'
import { scrollInto } from '../ScrollInto/ScrollInto.ts'

const getPathPartChildren = async (pathPart: any): Promise<readonly any[]> => {
  const children = await getChildDirents(pathPart.pathSeparator, pathPart)
  return children
}

const mergeVisibleWithHiddenItems = (visibleItems: readonly ExplorerItem[], hiddenItems: readonly ExplorerItem[]): readonly ExplorerItem[] => {
  const merged = [...visibleItems, ...hiddenItems]
  const seen = Object.create(null)
  const unique = []
  for (const item of merged) {
    if (seen[item.path]) {
      continue
    }
    seen[item.path] = true
    unique.push(item)
  }
  return unique
}

// TODO maybe just insert items into explorer and refresh whole explorer
export const revealItemHidden = async (state: ExplorerState, uri: string): Promise<ExplorerState> => {
  const { root, pathSeparator, items, minLineY, maxLineY } = state
  const pathParts = getPathParts(root, uri, pathSeparator)
  if (pathParts.length === 0) {
    return state
  }
  const pathPartsToReveal = getPathPartsToReveal(root, pathParts, items)
  const pathPartsChildren = await Promise.all(pathPartsToReveal.map(getPathPartChildren))
  const pathPartsChildrenFlat = pathPartsChildren.flat(1)
  const orderedPathParts = orderDirents(pathPartsChildrenFlat)
  const mergedDirents = mergeVisibleWithHiddenItems(items, orderedPathParts)
  const index = getIndex(mergedDirents, uri)
  if (index === -1) {
    throw new Error(`File not found in explorer ${uri}`)
  }
  const { newMinLineY, newMaxLineY } = scrollInto(index, minLineY, maxLineY)
  return {
    ...state,
    items: mergedDirents,
    focused: true,
    focusedIndex: index,
    minLineY: newMinLineY,
    maxLineY: newMaxLineY,
  }
}
