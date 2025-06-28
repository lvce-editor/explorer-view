import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { NativeFilesResult } from '../NativeFilesResult/NativeFilesResult.ts'
import * as AdjustScrollAfterPaste from '../AdjustScrollAfterPaste/AdjustScrollAfterPaste.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import { getIndex } from '../GetIndex/GetIndex.ts'
import { getBaseName } from '../Path/Path.ts'
import { refresh } from '../Refresh/Refresh.ts'

export const handlePasteCut = async (state: ExplorerState, nativeFiles: NativeFilesResult): Promise<ExplorerState> => {
  const { root, pathSeparator } = state
  for (const source of nativeFiles.files) {
    const target = `${root}${pathSeparator}${getBaseName(pathSeparator, source)}`
    await FileSystem.rename(source, target)
  }

  // Refresh the state after cut operations
  const latestState = await refresh(state)

  // Focus on the first pasted file and adjust scroll position
  if (nativeFiles.files.length > 0) {
    const firstPastedFile = nativeFiles.files[0]
    const targetPath = `${root}${pathSeparator}${getBaseName(pathSeparator, firstPastedFile)}`
    const pastedFileIndex = getIndex(latestState.items, targetPath)
    if (pastedFileIndex !== -1) {
      const adjustedState = AdjustScrollAfterPaste.adjustScrollAfterPaste(latestState, pastedFileIndex)
      return {
        ...adjustedState,
        pasteShouldMove: false,
      }
    }
  }

  return {
    ...latestState,
    pasteShouldMove: false,
  }
}
