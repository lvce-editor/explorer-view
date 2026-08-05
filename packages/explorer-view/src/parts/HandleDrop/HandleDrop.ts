import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import { getDroppedItems } from '../GetDroppedItems/GetDroppedItems.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { getInternalDragPaths } from '../GetInternalDragPaths/GetInternalDragPaths.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import { VError } from '../VError/VError.ts'

export const handleDrop = async (state: ExplorerState, x: number, y: number, fileIds: readonly number[]): Promise<ExplorerState> => {
  if (state.isReadonly && state.root !== '') {
    return state
  }
  try {
    const isElectron = state.platform === PlatformType.Electron
    const { fileHandles, paths, uris } = await getDroppedItems(fileIds, isElectron)
    const internalPaths = getInternalDragPaths(state.items, uris)
    const droppedPaths = internalPaths.length > 0 ? internalPaths : paths
    const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
    const fn = getDropHandler(index)
    const result = await fn(state, fileHandles, [], droppedPaths, index)
    return result
  } catch (error) {
    throw new VError(error, 'Failed to drop files')
  }
}
