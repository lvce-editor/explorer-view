import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getChildDirentsRaw } from '../GetChildDirentsRaw/GetChildDirentsRaw.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as MouseEventType from '../MouseEventType/MouseEventType.ts'

type DirectoryPreload = NonNullable<ExplorerState['directoryPreload']>

const preloadDirents = async (preload: DirectoryPreload, uri: string, applicationId?: string): Promise<void> => {
  try {
    preload.dirents = await getChildDirentsRaw(uri, applicationId)
    const timeout = setTimeout(() => {
      preload.dirents = undefined
    }, 5000)
    timeout.unref?.()
  } catch {
    // Ignore speculative read failures; expansion will retry through the normal path.
  }
}

export const handlePointerDown = (state: ExplorerState, button: number, x: number, y: number): ExplorerState => {
  const { applicationId, directoryPreload, items, root } = state
  const index = getIndexFromPosition(state, x, y)
  if (button === MouseEventType.LeftClick && index === -1) {
    return {
      ...state,
      directoryPreload: undefined,
      focus: FocusId.List,
      focused: true,
      focusedIndex: -1,
    }
  }
  if (button === MouseEventType.LeftClick) {
    const item = items[index]
    const canPreload = item && (item.type === DirentType.Directory || item.type === DirentType.SymLinkFolder)
    let directoryPreload: DirectoryPreload | undefined
    if (canPreload) {
      directoryPreload = {
        applicationId,
        dirents: undefined,
        promise: Promise.resolve(),
        root,
        uri: item.uri,
      }
      directoryPreload.promise = preloadDirents(directoryPreload, item.uri, applicationId)
    }
    return {
      ...state,
      directoryPreload,
      isPointerDown: true,
      pointerDownIndex: index,
    }
  }
  if (!directoryPreload) {
    return state
  }
  return {
    ...state,
    directoryPreload: undefined,
  }
}
