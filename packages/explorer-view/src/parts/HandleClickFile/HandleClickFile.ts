import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../CommandCompletion/CommandCompletion.ts'
import * as OpenUri from '../OpenUri/OpenUri.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const openFile = async (uid: number, dirent: ExplorerItem, keepFocus: boolean): Promise<void> => {
  await OpenUri.openUri(dirent.path, !keepFocus, {
    preview: true,
  })
  if (!keepFocus) {
    if (RendererProcess.isConnected()) {
      RendererProcess.requestPostRenderFocus(uid)
    } else {
      setTimeout(() => {
        void RendererWorker.invoke('Main.focus')
      }, 0)
    }
  }
}

export const handleClickFile = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus = false): Promise<ExplorerState> => {
  const { uid } = state
  const completion = openFile(uid, dirent, keepFocus)
  const newState = {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
  }
  return CommandCompletion.set(newState, completion)
}
