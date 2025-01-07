import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { getBaseName } from '../Path/Path.ts'

export const handlePasteCut = async (state: ExplorerState, nativeFiles: any): Promise<ExplorerState> => {
  for (const source of nativeFiles.files) {
    const target = `${state.root}${state.pathSeparator}${getBaseName(state.pathSeparator, source)}`
    await FileSystem.rename(source, target)
  }
  return state
}
