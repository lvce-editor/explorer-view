import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getDropHandler } from '../GetDropHandler/GetDropHandler.ts'
import { getFileHandles } from '../GetFileHandles/GetFileHandles.ts'
import * as GetIndexFromPosition from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { VError } from '../VError/VError.ts'

export const handleDrop = async (
  state: ExplorerState,
  x: number,
  y: number,
  fileIds: readonly number[],
  files: readonly File[],
): Promise<ExplorerState> => {
  try {
    console.log({ files2: files })
    const fileHandles = await getFileHandles(fileIds)
    const index = GetIndexFromPosition.getIndexFromPosition(state, x, y)
    const fn = getDropHandler(index)
    const result = await fn(state, fileHandles, files, index)
    return result
  } catch (error) {
    throw new VError(error, 'Failed to drop files')
  }
}
