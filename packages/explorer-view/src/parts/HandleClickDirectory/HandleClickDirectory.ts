import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import { getPathDirentsMap } from '../GetPathDirentsMap/GetPathDirentsMap.ts'
import { getProtoMapInternal } from '../GetProtoMapInternal/GetProtoMapInternal.ts'
import { sortPathDirentsMap } from '../SortPathDirentsMap/SortPathDirentsMap.ts'

const getRestoredChildDirents = async (state: ExplorerState, dirent: ExplorerItem): Promise<readonly ExplorerItem[]> => {
  const { applicationId } = state
  const { excluded, expandedPaths, pathSeparator, preserveExpandState, root } = state
  const descendantPrefix = dirent.path.endsWith(pathSeparator) ? dirent.path : `${dirent.path}${pathSeparator}`
  const descendantExpandedPaths = preserveExpandState ? expandedPaths.filter((path) => path.startsWith(descendantPrefix)) : []
  if (descendantExpandedPaths.length === 0) {
    return GetChildDirents.getChildDirents(pathSeparator, dirent.path, dirent.depth, excluded, root, applicationId)
  }
  const pathToDirents = await getPathDirentsMap([dirent.path, ...descendantExpandedPaths], applicationId)
  const sortedPathDirents = sortPathDirentsMap(pathToDirents)
  return getProtoMapInternal(dirent.path, sortedPathDirents, descendantExpandedPaths, dirent.depth + 1, excluded, root)
}

export const handleClickDirectory = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus: boolean): Promise<ExplorerState> => {
  // @ts-ignore
  dirent.type = DirentType.DirectoryExpanding
  // TODO handle error
  const dirents = await getRestoredChildDirents(state, dirent)
  const state2 = state
  if (!state2) {
    return state
  }
  // TODO use Viewlet.getState here and check if it exists
  const newIndex = state2.items.indexOf(dirent)
  // TODO if viewlet is disposed or root has changed, return
  if (newIndex === -1) {
    return state
  }
  const newDirents = [...state2.items]
  newDirents.splice(newIndex + 1, 0, ...dirents)
  // @ts-ignore
  dirent.type = DirentType.DirectoryExpanded
  // TODO when focused index has changed while expanding, don't update it

  return {
    ...state,
    focus: FocusId.List,
    focused: keepFocus,
    focusedIndex: newIndex,
    items: newDirents,
  }
}
