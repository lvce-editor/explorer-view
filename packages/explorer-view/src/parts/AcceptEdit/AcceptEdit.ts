import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import * as ComputeExplorerRenamedDirent from '../ComputeExplorerRenamedDirent/ComputeExplorerRenamedDirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as Path from '../Path/Path.ts'

const getParentFolder = (dirents: any, index: number, root: string): string => {
  if (index < 0) {
    return root
  }
  return dirents[index].path
}

const acceptCreate = async (state: ExplorerState, newDirentType: any, createFn: any): Promise<ExplorerState> => {
  const { focusedIndex, editingValue } = state
  const newFileName = editingValue
  if (!newFileName) {
    // TODO show error message that file name must not be empty
    // below input box
    // await ErrorHandling.showErrorDialog(new Error('file name must not be empty'))
    return state
  }
  const parentFolder = getParentFolder(state.items, focusedIndex, state.root)
  const absolutePath = [parentFolder, newFileName].join(state.pathSeparator)
  // TODO better handle error
  try {
    await createFn(absolutePath)
  } catch (error) {
    // TODO display error
    return state
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
  newDirent.icon = IconTheme.getIcon(newDirent)
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
  const newMaxlineY = Math.max(state.maxLineY, newDirents.length)
  return {
    ...state,
    items: newDirents,
    editingIndex: -1,
    focusedIndex: insertIndex + 1,
    editingType: ExplorerEditingType.None,
    maxLineY: newMaxlineY,
  }
}

const acceptRename = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingIndex, editingValue, items, pathSeparator } = state
  const renamedDirent = items[editingIndex]
  try {
    // TODO this does not work with rename of nested file
    const oldAbsolutePath = renamedDirent.path
    const oldParentPath = Path.dirname(pathSeparator, oldAbsolutePath)
    const newAbsolutePath = [oldParentPath, editingValue].join(pathSeparator)
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)
  } catch (error) {
    // TODO
    // await ErrorHandling.showErrorDialog(error)
    return state
  }
  const { newDirents, focusedIndex } = ComputeExplorerRenamedDirent.computeExplorerRenamedDirent(items, editingIndex, editingValue)
  //  TODO move focused index
  // @ts-ignore
  state.items = newDirents
  return {
    ...state,
    editingIndex: -1,
    editingValue: '',
    editingType: ExplorerEditingType.None,
    editingIcon: '',
    focusedIndex,
    focused: true,
  }
}

export const acceptEdit = (state: any): Promise<any> => {
  const { editingType } = state
  switch (editingType) {
    case ExplorerEditingType.CreateFile:
      return acceptCreate(state, DirentType.File, FileSystem.createFile)
    case ExplorerEditingType.CreateFolder:
      return acceptCreate(state, DirentType.Directory, FileSystem.mkdir)
    case ExplorerEditingType.Rename:
      return acceptRename(state)
    default:
      return state
  }
}
