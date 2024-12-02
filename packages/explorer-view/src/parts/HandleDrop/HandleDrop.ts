import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { handleDropIndex } from '../HandleDropIndex/HandleDropIndex.ts'
import { handleDropRoot } from '../HandleDropRoot/HandleDropRoot.ts'
import { VError } from '../VError/VError.ts'

export const handleDrop = async (state: any, x: number, y: number, files: any): Promise<any> => {
  try {
    const index = getIndexFromPosition(state, x, y)
    switch (index) {
      case -1:
        return await handleDropRoot(state, files)
      default:
        return await handleDropIndex(state, index, files)
    }
  } catch (error) {
    throw new VError(error, 'Failed to drop files')
  }
}
