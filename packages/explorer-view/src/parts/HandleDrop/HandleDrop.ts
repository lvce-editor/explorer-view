import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import * as HandleDropIndex from '../HandleDropIndex/HandleDropIndex.ts'
import * as HandleDropRoot from '../HandleDropRoot/HandleDropRoot.ts'
import { VError } from '../VError/VError.ts'

export const handleDrop = async (state: ExplorerState, x: number, y: number, files: any): Promise<ExplorerState> => {
  try {
    const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
    switch (index) {
      case -1:
        return await HandleDropRoot.handleDropRoot(state, files)
      default:
        return await HandleDropIndex.handleDropIndex(state, index, files)
    }
  } catch (error) {
    throw new VError(error, 'Failed to drop files')
  }
}
