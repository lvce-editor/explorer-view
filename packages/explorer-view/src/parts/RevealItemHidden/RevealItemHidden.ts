import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { getPathParts } from '../GetPathParts/GetPathParts.ts'
import { orderDirents } from '../OrderDirents/OrderDirents.ts'
import { scrollInto } from '../ScrollInto/ScrollInto.ts'

const getPathPartsToReveal = (root: string, pathParts: readonly any[], dirents: readonly ExplorerItem[]): readonly any[] => {
  for (let i = 0; i < pathParts.length; i++) {
    const pathPart = pathParts[i]
    const index = getIndex(dirents, pathPart.uri)
    if (index === -1) {
      continue
    }
    return pathParts.slice(i)
  }
  return pathParts
}

const getPathPartChildren = async (pathPart: any): Promise<readonly any[]> => {
  const children = await getChildDirents(pathPart.pathSeparator, pathPart)
  return children
}

const mergeVisibleWithHiddenItems = (visibleItems: readonly any[], hiddenItems: readonly any[]): readonly any[] => {
  const merged = [...hiddenItems]
  const seen = Object.create(null)
  const unique = []
  for (const item of merged) {
    if (seen[item.path]) {
      continue
    }
    seen[item.path] = true
    unique.push(item)
  }
  // @ts-ignore
  const ordered = []

  // depth one
  //   let depth=1
  //   while(true){
  //     for(const item of unique){
  //       if(item.depth===depth){
  //         ordered.push(item)
  //       }
  //     }
  // break
  //   }
  // const getChildren = (path) => {
  //   const children = []
  //   for (const item of unique) {
  //     if (item.path.startsWith(path) && item.path !== path) {
  //       ordered.push(item)
  //     }
  //   }
  //   return children
  // }
  // for (const item of unique) {
  //   for (const potentialChild of unique) {
  //     if (
  //       potentialChild.path.startsWith(item.path) &&
  //       potentialChild.path !== item.path
  //     ) {
  //       ordered.push(potentialChild)
  //     }
  //   }
  // }
  // const refreshedRoots = Object.create(null)
  // for (const hiddenItem of hiddenItems) {
  //   const parent = hiddenItem.path.slice(0, hiddenItem.path.lastIndexOf('/'))
  //   refreshedRoots[parent] = true
  // }
  // const mergedDirents = []
  // for(const v)
  // for (const visibleItem of visibleItems) {
  //   if (visibleItem.path === hiddenItemRoot) {
  //     // TODO update aria posinset and aria setsize
  //     mergedDirents.push(...hiddenItems)
  //   } else {
  //     for (const hiddenItem of hiddenItems) {
  //       if (hiddenItem.path === visibleItem.path) {
  //         continue
  //       }
  //     }
  //     mergedDirents.push(visibleItem)
  //   }
  // }

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
