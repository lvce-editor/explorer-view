import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Path from '../Path/Path.ts'
import { getBaseName } from '../Path/Path.ts'
import { updateRoot } from '../UpdateRoot/UpdateRoot.ts'
import * as Viewlet from '../Viewlet/Viewlet.ts' // TODO should not import viewlet manager -> avoid cyclic dependency

export const handlePasteCopy = async (state: any, nativeFiles: any): Promise<any> => {
  // TODO handle pasting files into nested folder
  // TODO handle pasting files into symlink
  // TODO handle pasting files into broken symlink
  // TODO handle pasting files into hardlink
  // TODO what if folder is big and it takes a long time
  for (const source of nativeFiles.files) {
    const target = Path.join(state.pathSeperator, state.root, getBaseName(state.pathSeparator, source))
    await FileSystem.copy(source, target)
  }
  const stateNow = Viewlet.getState('Explorer')
  if (stateNow.disposed) {
    return
  }
  // TODO only update folder at which level it changed
  return updateRoot(state)
}
