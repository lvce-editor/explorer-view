import { VError } from '@lvce-editor/verror'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'

const getParentFolder = (dirents: readonly ExplorerItem[], index: number, root: string): string => {
  if (index < 0) {
    return root
  }
  return dirents[index].path
}

export interface Create {
  (path: string): Promise<void>
}

interface NewDirentsAcceptResult {
  readonly dirents: readonly ExplorerItem[]
  readonly newFocusedIndex: number
}

export const getNewDirentsAccept = async (state: ExplorerState, newDirentType: number, createFn: Create): Promise<NewDirentsAcceptResult> => {
  const { focusedIndex, editingValue } = state
  const newFileName = editingValue
  const parentFolder = getParentFolder(state.items, focusedIndex, state.root)
  const absolutePath = [parentFolder, newFileName].join(state.pathSeparator)
  // TODO better handle error
  try {
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
  const newDirent = {
    path: absolutePath,
    posInSet: -1,
    setSize: 1,
    depth,
    name: newFileName,
    type: newDirentType,
    icon: '',
  }
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
  newDirent.setSize = setSize
  newDirent.posInSet = posInSet
  // @ts-ignore
  items.splice(insertIndex + 1, 0, newDirent)
  const newDirents = [...items]
  return {
    dirents: newDirents,
    newFocusedIndex: insertIndex + 1,
  }
}
