import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import { getPathDirentsMap } from '../GetPathDirentsMap/GetPathDirentsMap.ts'
import { getProtoMapInternal } from '../GetProtoMapInternal/GetProtoMapInternal.ts'
import { sortPathDirentsMap } from '../SortPathDirentsMap/SortPathDirentsMap.ts'
import * as ToDisplayDirents from '../ToDisplayDirents/ToDisplayDirents.ts'

const getRestoredChildDirents = async (
  state: ExplorerState,
  dirent: ExplorerItem,
  preloadedDirents?: readonly RawDirent[],
): Promise<readonly ExplorerItem[]> => {
  const { applicationId, excluded, expandedPaths, pathSeparator, preserveExpandState, root } = state
  const descendantPrefix = dirent.uri.endsWith(pathSeparator) ? dirent.uri : `${dirent.uri}${pathSeparator}`
  const descendantExpandedPaths = preserveExpandState ? expandedPaths.filter((path) => path.startsWith(descendantPrefix)) : []
  if (descendantExpandedPaths.length === 0) {
    if (preloadedDirents) {
      return ToDisplayDirents.toDisplayDirents(pathSeparator, preloadedDirents, dirent.uri, dirent.depth, excluded, false, root)
    }
    return GetChildDirents.getChildDirents(pathSeparator, dirent.uri, dirent.depth, excluded, root, applicationId)
  }
  const pathsToRead = preloadedDirents ? descendantExpandedPaths : [dirent.uri, ...descendantExpandedPaths]
  const pathToDirents = await getPathDirentsMap(pathsToRead, applicationId)
  if (preloadedDirents) {
    pathToDirents[dirent.uri] = preloadedDirents
  }
  const sortedPathDirents = sortPathDirentsMap(pathToDirents)
  return getProtoMapInternal(dirent.uri, sortedPathDirents, descendantExpandedPaths, dirent.depth + 1, excluded, root)
}

export const handleClickDirectory = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus: boolean): Promise<ExplorerState> => {
  const { applicationId, directoryPreload: preload, root } = state
  const matchesPreload = preload && preload.uri === dirent.uri && preload.root === root && preload.applicationId === applicationId
  const stateWithoutPreload = {
    ...state,
    directoryPreload: undefined,
  }
  // @ts-expect-error Legacy directory expansion mutates readonly items.
  dirent.type = DirentType.DirectoryExpanding
  // TODO handle error
  let preloadedDirents: readonly RawDirent[] | undefined
  if (matchesPreload) {
    await preload.promise
    preloadedDirents = preload.dirents
    preload.dirents = undefined
  }
  const dirents = await getRestoredChildDirents(stateWithoutPreload, dirent, preloadedDirents)
  const state2 = stateWithoutPreload
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
  // @ts-expect-error Legacy directory expansion mutates readonly items.
  dirent.type = DirentType.DirectoryExpanded
  // TODO when focused index has changed while expanding, don't update it

  return {
    ...stateWithoutPreload,
    focus: FocusId.List,
    focused: keepFocus,
    focusedIndex: newIndex,
    items: newDirents,
  }
}
