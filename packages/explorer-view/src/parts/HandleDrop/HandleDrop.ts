import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import { getFileHandles } from '../GetFileHandles/GetFileHandles.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { VError } from '../VError/VError.ts'

export const handleDrop = async (state: ExplorerState, x: number, y: number, fileIds: readonly number[]): Promise<ExplorerState> => {
  try {
    const files = await getFileHandles(fileIds)
    const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
    const fn = getDropHandler(index)
    const result = await fn(state, files, index)
    return result
  } catch (error) {
    throw new VError(error, 'Failed to drop files')
  }
}
