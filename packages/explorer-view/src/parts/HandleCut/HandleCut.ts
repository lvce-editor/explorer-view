import { WhenExpression } from '@lvce-editor/constants'
import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ClipBoard from '../ClipBoard/ClipBoard.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import { getSelectedItems } from '../GetSelectedItems/GetSelectedItems.ts'

export const handleCut = async (state: ExplorerState): Promise<ExplorerState> => {
  const { focusedIndex, isReadonly, items } = state
  if (isReadonly) {
    return state
  }
  // TODO handle multiple files
  // TODO if not file is selected, what happens?
  const dirents = getSelectedItems(items, focusedIndex)
  if (dirents.length === 0) {
    return state
  }
  const files = dirents.map((dirent) => dirent.path)
  await ClipBoard.writeNativeFiles('cut', files)
  await RendererWorker.invoke('Focus.setFocus', WhenExpression.FocusExplorer)
  return {
    ...state,
    cutItems: files,
    focus: FocusId.List,
    focused: true,
    pasteShouldMove: true,
  }
}
