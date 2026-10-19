import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { NewDirentsAcceptResult } from '../NewDirentsAcceptResult/NewDirentsAcceptResult.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import { getParentFolder } from '../GetParentFolder/GetParentFolder.ts'

export const getNewDirentsAccept = (
  items: readonly ExplorerItem[],
  focusedIndex: number,
  editingValue: string,
  root: string,
  pathSeparator: string,
  newDirentType: number,
): NewDirentsAcceptResult => {
  const newFileName = editingValue
  const parentFolder = getParentFolder(items, focusedIndex, root, pathSeparator)
  const absolutePath = [parentFolder, newFileName].join(pathSeparator)

  const parentDirent =
    focusedIndex >= 0
      ? items[focusedIndex]
      : {
          depth: 0,
          uri: root,
        }
  const depth = parentDirent.depth + 1
  const newDirent: ExplorerItem = {
    depth,
    name: newFileName,
    posInSet: -1,
    selected: false,
    setSize: 1,
    type: newDirentType,
    uri: absolutePath,
  }
  let insertIndex = focusedIndex
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
      break
    }
    // @ts-expect-error Legacy sibling metadata can be absent.
    posInSet = dirent.posInSet + 1
    // @ts-expect-error Legacy sibling metadata can be absent.
    setSize = dirent.setSize + 1
    insertIndex = i
    // @ts-expect-error Legacy insertion mutates readonly sibling metadata.
    dirent.setSize++
  }
  // @ts-expect-error Legacy insertion mutates readonly sibling metadata.
  newDirent.setSize = setSize
  // @ts-expect-error Legacy insertion mutates readonly sibling metadata.
  newDirent.posInSet = posInSet
  const newItems = [...items]
  newItems.splice(insertIndex + 1, 0, newDirent)
  return {
    dirents: newItems,
    newFocusedIndex: insertIndex + 1,
  }
}
