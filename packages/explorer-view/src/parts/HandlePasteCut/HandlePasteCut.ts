import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as AdjustScrollAfterPaste from '../AdjustScrollAfterPaste/AdjustScrollAfterPaste.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { getBaseName } from '../Path/Path.ts'
import { refresh } from '../Refresh/Refresh.ts'

export const handlePasteCut = async (state: ExplorerState, nativeFiles: any): Promise<ExplorerState> => {
  for (const source of nativeFiles.files) {
    const target = `${state.root}${state.pathSeparator}${getBaseName(state.pathSeparator, source)}`
    await FileSystem.rename(source, target)
  }

  // Refresh the state after cut operations
  const latestState = await refresh(state)

  // Focus on the first pasted file and adjust scroll position
  if (nativeFiles.files.length > 0) {
    const firstPastedFile = nativeFiles.files[0]
    const targetPath = `${state.root}${state.pathSeparator}${getBaseName(state.pathSeparator, firstPastedFile)}`
    const pastedFileIndex = getIndex(latestState.items, targetPath)
    if (pastedFileIndex !== -1) {
      return AdjustScrollAfterPaste.adjustScrollAfterPaste(latestState, pastedFileIndex)
    }
  }

  return latestState
}
