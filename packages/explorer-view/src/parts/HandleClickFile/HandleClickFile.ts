import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../CommandCompletion/CommandCompletion.ts'
import * as OpenUri from '../OpenUri/OpenUri.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'

const focusDelay = 100

const focusEditor = async (): Promise<void> => {
  try {
    const editorUid = await RendererWorker.invoke('GetActiveEditor.getActiveEditorId')
    if (typeof editorUid !== 'number' || editorUid < 0) {
      throw new Error('active editor not found')
    }
    await RendererWorker.invoke('Editor.handleBlur', editorUid)
    await RendererWorker.invoke('Editor.handleFocus', editorUid)
  } catch {
    await RendererWorker.invoke('Main.focus')
  }
}

const openFile = async (uid: number, dirent: ExplorerItem, keepFocus: boolean): Promise<void> => {
  await OpenUri.openUri(dirent.path, !keepFocus, {
    preview: true,
  })
  if (!keepFocus) {
    await focusEditor()
    if (RendererProcess.isConnected()) {
      RendererProcess.requestPostRenderFocus(uid, focusDelay)
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
