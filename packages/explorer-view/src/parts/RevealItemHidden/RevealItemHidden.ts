import * as Command from '../Command/Command.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getPathParts } from '../GetPathParts/GetPathParts.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import { orderDirents } from '../OrderDirents/OrderDirents.ts'
import { scrollInto } from '../ScrollInto/ScrollInto.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'
import { getChildDirents } from './ViewletExplorerShared.ts'
// TODO viewlet should only have create and refresh functions
// every thing else can be in a separate module <viewlet>.lazy.js
// and  <viewlet>.ipc.js

// viewlet: creating | refreshing | done | disposed
// TODO recycle viewlets (maybe)

// TODO instead of root string, there should be a root dirent

// @ts-ignore
const isExpandedDirectory = (dirent) => {
  return dirent.type === DirentType.DirectoryExpanded
}

// @ts-ignore
const getPath = (dirent) => {
  return dirent.path
}

const getSavedChildDirents = (map, path, depth, excluded, pathSeparator) => {
  const children = map[path]
  if (!children) {
    return []
  }
  const dirents = []
  SortExplorerItems.sortExplorerItems(children)
  const visible = []
  const displayRoot = path.endsWith(pathSeparator) ? path : path + pathSeparator
  for (const child of children) {
    if (excluded.includes(child.name)) {
      continue
    }
    visible.push(child)
  }
  const visibleLength = visible.length
  for (let i = 0; i < visibleLength; i++) {
    const child = visible[i]
    const { name, type } = child
    const childPath = displayRoot + name
    if ((child.type === DirentType.Directory || child.type === DirentType.SymLinkFolder) && childPath in map) {
      dirents.push({
        depth,
        posInSet: i + 1,
        setSize: visibleLength,
        icon: IconTheme.getFolderIcon({ name }),
        name,
        path: childPath,
        type: DirentType.DirectoryExpanded,
      })
      dirents.push(...getSavedChildDirents(map, childPath, depth + 1, excluded, pathSeparator))
    } else {
      dirents.push({
        depth,
        posInSet: i + 1,
        setSize: visibleLength,
        icon: IconTheme.getIcon({ type, name }),
        name,
        path: childPath,
        type,
      })
    }
  }
  return dirents
}

// TODO rename dirents to items, then can use virtual list component directly

// TODO support multiselection and removing multiple dirents

// TODO use posInSet and setSize properties to compute more effectively

// TODO much shared logic with newFolder

// export const handleBlur=()=>{}

// TODO what happens when mouse leave and anther mouse enter event occur?
// should update preview instead of closing and reopening

const getIndex = (dirents, uri) => {
  for (let i = 0; i < dirents.length; i++) {
    const dirent = dirents[i]
    if (dirent.path === uri) {
      return i
    }
  }
  return -1
}

const getPathPartsToReveal = (root, pathParts, dirents) => {
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

const getPathPartChildren = (pathPart) => {
  const children = getChildDirents(pathPart.pathSeparator, pathPart)
  return children
}

const mergeVisibleWithHiddenItems = (visibleItems, hiddenItems) => {
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
export const revealItemHidden = async (state: any, uri: string): Promise<any> => {
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
