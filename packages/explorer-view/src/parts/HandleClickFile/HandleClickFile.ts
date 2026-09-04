import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CommandCompletion from '../CommandCompletion/CommandCompletion.ts'
import * as OpenUri from '../OpenUri/OpenUri.ts'

const focusEditor = async (): Promise<void> => {
  try {
    await RendererWorker.invoke('Editor.handleBlur')
    await RendererWorker.invoke('Editor.handleFocus')
  } catch {
    await RendererWorker.invoke('Main.focus')
  }
}

const openFile = async (dirent: ExplorerItem, keepFocus: boolean): Promise<void> => {
  await OpenUri.openUri(dirent.path, !keepFocus, {
    preview: true,
  })
  if (!keepFocus) {
    await focusEditor()
  }
}

export const handleClickFile = async (state: ExplorerState, dirent: ExplorerItem, index: number, keepFocus = false): Promise<ExplorerState> => {
  const completion = openFile(dirent, keepFocus)
  const newState = {
    ...state,
    focused: keepFocus,
    focusedIndex: index,
  }
  return CommandCompletion.set(newState, completion)
}
