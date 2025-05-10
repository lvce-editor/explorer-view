import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { NewDirentsAcceptResult } from '../NewDirentsAcceptResult/NewDirentsAcceptResult.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { getParentFolder } from '../GetParentFolder/GetParentFolder.ts'

export const getNewDirentsAccept = (state: ExplorerState, newDirentType: number): NewDirentsAcceptResult => {
  const { focusedIndex, editingValue, items } = state
  const newFileName = editingValue
  const parentFolder = getParentFolder(state.items, focusedIndex, state.root)
  const absolutePath = [parentFolder, newFileName].join(state.pathSeparator)

  const parentDirent =
    focusedIndex >= 0
      ? state.items[focusedIndex]
      : {
          depth: 0,
          path: state.root,
        }
  const depth = parentDirent.depth + 1
  const newDirent: ExplorerItem = {
    path: absolutePath,
    // @ts-ignore
    posInSet: -1,
    setSize: 1,
    depth,
    name: newFileName,
    type: newDirentType,
    icon: '',
    selected: false,
  }
  // @ts-ignore
  newDirent.icon = ''
  let insertIndex = focusedIndex
  let deltaPosInSet = 0
  let posInSet = 1
  let setSize = 1
  let i = Math.max(focusedIndex, -1) + 1
  // TODO update posinset and setsize of all affected dirents
  for (; i < items.length; i++) {
    const dirent = items[i]
    if (dirent.depth !== depth) {
      break
    }
    const compareResult = CompareDirent.compareDirent(dirent, newDirent)
    if (compareResult === 1) {
      insertIndex = i - 1
      deltaPosInSet = 1 - 1
      break
    } else {
      // @ts-ignore
      posInSet = dirent.posInSet + 1
      // @ts-ignore
      setSize = dirent.setSize + 1
      // @ts-ignore
      insertIndex = i
    }
    // @ts-ignore
    dirent.setSize++
    // @ts-ignore
    dirent.posInSet += deltaPosInSet
  }
  // @ts-ignore
  newDirent.setSize = setSize
  // @ts-ignore
  newDirent.posInSet = posInSet
  const newItems = [...items]
  newItems.splice(insertIndex + 1, 0, newDirent)
  return {
    dirents: newItems,
    newFocusedIndex: insertIndex + 1,
  }
}
