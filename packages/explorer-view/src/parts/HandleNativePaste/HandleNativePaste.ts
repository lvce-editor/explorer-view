import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import { getClipboardItems } from '../GetDroppedItems/GetDroppedItems.ts'
import * as HandlePaste from '../HandlePaste/HandlePaste.ts'
import * as HandlePasteCopy from '../HandlePasteCopy/HandlePasteCopy.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import { VError } from '../VError/VError.ts'

export const handleNativePaste = async (state: ExplorerState, itemIds: readonly number[]): Promise<ExplorerState> => {
  const { focusedIndex, isReadonly, platform } = state
  if (isReadonly) {
    return state
  }
  if (itemIds.length === 0) {
    return HandlePaste.handlePaste(state)
  }
  try {
    const isElectron = platform === PlatformType.Electron
    const { fileHandles, paths } = await getClipboardItems(itemIds, isElectron)
    if (isElectron) {
      const nativePaths = paths.filter(Boolean)
      if (nativePaths.length === 0) {
        return HandlePaste.handlePaste(state)
      }
      return HandlePasteCopy.handlePasteCopy(state, {
        files: nativePaths,
        source: 'gnomeCopiedFiles',
        type: 'copy',
      })
    }
    const handleDrop = getDropHandler(focusedIndex)
    return handleDrop(state, fileHandles, paths, focusedIndex)
  } catch (error) {
    throw new VError(error, 'Failed to paste native files')
  }
}
