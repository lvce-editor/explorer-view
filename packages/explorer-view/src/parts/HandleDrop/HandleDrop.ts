import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as HandleDropIndex from '../HandleDropIndex/HandleDropIndex.ts'
import * as HandleDropRoot from '../HandleDropRoot/HandleDropRoot.ts'
import * as ParentRpc from '../ParentRpc/ParentRpc.ts'
import { VError } from '../VError/VError.ts'

interface DropHandler {
  (state: ExplorerState, files: readonly FileSystemHandle[], index: number): Promise<ExplorerState>
}

const getDropHandler = (index: number): DropHandler => {
  switch (index) {
    case -1:
      return HandleDropRoot.handleDropRoot
    default:
      return HandleDropIndex.handleDropIndex
  }
}

export const handleDrop = async (state: ExplorerState, x: number, y: number, fileIds: readonly number[]): Promise<ExplorerState> => {
  try {
    const files = await ParentRpc.invoke('FileSystemHandle.getFileHandles', fileIds)
    const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
    const fn = getDropHandler(index)
    const result = await fn(state, files, index)
    return result
  } catch (error) {
    throw new VError(error, 'Failed to drop files')
  }
}
