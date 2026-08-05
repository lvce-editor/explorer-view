import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import { getDroppedItems } from '../GetDroppedItems/GetDroppedItems.ts'
import * as HandlePaste from '../HandlePaste/HandlePaste.ts'
import * as HandlePasteCopy from '../HandlePasteCopy/HandlePasteCopy.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import { VError } from '../VError/VError.ts'

export const handleNativePaste = async (state: ExplorerState, itemIds: readonly number[]): Promise<ExplorerState> => {
  if (state.isReadonly) {
    return state
  }
  if (itemIds.length === 0) {
    return HandlePaste.handlePaste(state)
  }
  try {
    const isElectron = state.platform === PlatformType.Electron
    const { fileHandles, paths } = await getDroppedItems(itemIds, isElectron)
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
    const index = state.focusedIndex
    const handleDrop = getDropHandler(index)
    return handleDrop(state, fileHandles, [], paths, index)
  } catch (error) {
    throw new VError(error, 'Failed to paste native files')
  }
}
