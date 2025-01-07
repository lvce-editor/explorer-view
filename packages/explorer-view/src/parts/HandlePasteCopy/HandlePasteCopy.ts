import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Path from '../Path/Path.ts'
import { getBaseName } from '../Path/Path.ts'
import { updateRoot } from '../UpdateRoot/UpdateRoot.ts'

export const handlePasteCopy = async (state: ExplorerState, nativeFiles: any): Promise<any> => {
  // TODO handle pasting files into nested folder
  // TODO handle pasting files into symlink
  // TODO handle pasting files into broken symlink
  // TODO handle pasting files into hardlink
  // TODO what if folder is big and it takes a long time
  for (const source of nativeFiles.files) {
    // @ts-ignore
    const target = Path.join(state.pathSeperator, state.root, getBaseName(state.pathSeparator, source))
    await FileSystem.copy(source, target)
  }
  // TODO only update folder at which level it changed
  return updateRoot(state)
}
