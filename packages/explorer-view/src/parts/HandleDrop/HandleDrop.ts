import { DragAndDropWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import { getDroppedItemsByDropId } from '../GetDroppedItems/GetDroppedItems.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { getInternalDragPaths } from '../GetInternalDragPaths/GetInternalDragPaths.ts'
import * as PlatformType from '../PlatformType/PlatformType.ts'
import { VError } from '../VError/VError.ts'

const clearDropTargets = (state: ExplorerState): ExplorerState => {
  const { dropTargets } = state
  if (dropTargets.length === 0) {
    return state
  }
  return {
    ...state,
    dropTargets: [],
  }
}

export const handleDrop = async (state: ExplorerState, x: number, y: number, dropId: number): Promise<ExplorerState> => {
  const { isReadonly, items, platform, root } = state
  try {
    if (isReadonly && root !== '') {
      await DragAndDropWorker.discardDrop(dropId)
      return clearDropTargets(state)
    }
    const isElectron = platform === PlatformType.Electron
    const { fileHandles, paths, uris } = await getDroppedItemsByDropId(dropId, isElectron)
    const internalPaths = getInternalDragPaths(items, uris)
    const droppedPaths = internalPaths.length > 0 ? internalPaths : paths
    const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
    const fn = getDropHandler(index)
    const result = await fn(state, fileHandles, droppedPaths, index)
    return result
  } catch (error) {
    console.error(new VError(error, 'Failed to drop files'))
    return clearDropTargets(state)
  }
}
