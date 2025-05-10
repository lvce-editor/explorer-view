import { VError } from '@lvce-editor/verror'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { NewDirentsAcceptResult } from '../NewDirentsAcceptResult/NewDirentsAcceptResult.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import * as CreateNestedPath from '../CreateNestedPath/CreateNestedPath.ts'
import { getParentFolder } from '../GetParentFolder/GetParentFolder.ts'
import * as Path from '../Path/Path.ts'

export interface Create {
  (path: string): Promise<void>
}

export const getNewDirentsAccept = async (state: ExplorerState, newDirentType: number, createFn: Create): Promise<NewDirentsAcceptResult> => {
  const { focusedIndex, editingValue } = state
  const newFileName = editingValue
  const parentFolder = getParentFolder(state.items, focusedIndex, state.root)
  const absolutePath = [parentFolder, newFileName].join(state.pathSeparator)

  try {
    // Create parent directories if they don't exist
    if (newFileName.includes(state.pathSeparator)) {
      const parentPath = Path.dirname(state.pathSeparator, absolutePath)
      await CreateNestedPath.createNestedPath(parentPath, state.pathSeparator)
    }
    await createFn(absolutePath)
  } catch (error) {
    console.error(new VError(error, `Failed to create file`))
    // TODO display error
    return {
      dirents: state.items,
      newFocusedIndex: state.focusedIndex,
    }
  }

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
  let insertIndex = state.focusedIndex
  let deltaPosInSet = 0
  let posInSet = 1
  let setSize = 1
  let i = Math.max(state.focusedIndex, -1) + 1
  const { items } = state
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
