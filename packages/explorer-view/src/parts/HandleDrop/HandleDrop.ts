import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import { getDroppedItems } from '../GetDroppedItems/GetDroppedItems.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { getInternalDragPaths } from '../GetInternalDragPaths/GetInternalDragPaths.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import { VError } from '../VError/VError.ts'

export const handleDrop = async (state: ExplorerState, x: number, y: number, dropIdOrFileIds: number | readonly number[]): Promise<ExplorerState> => {
  if (state.isReadonly && state.root !== '') {
    if (typeof dropIdOrFileIds === 'number') {
      await DragAndDropWorker.discardDrop(dropIdOrFileIds)
    }
    return state
  }
  try {
    const isElectron = state.platform === PlatformType.Electron
    const { fileHandles, paths, uris } = await getDroppedItems(dropIdOrFileIds, isElectron)
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
