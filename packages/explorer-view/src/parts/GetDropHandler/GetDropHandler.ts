import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as HandleDropIndex from '../HandleDropIndex/HandleDropIndex.ts'
import * as HandleDropRoot from '../HandleDropRoot/HandleDropRoot.ts'

interface DropHandler {
  (
    state: ExplorerState,
    fileHandles: readonly FileSystemHandle[],
    files: readonly File[],
    paths: readonly string[],
    index: number,
  ): Promise<ExplorerState>
}

export const getDropHandler = (index: number): DropHandler => {
  switch (index) {
    case -1:
      return HandleDropRoot.handleDropRoot
    default:
      return HandleDropIndex.handleDropIndex
  }
}
