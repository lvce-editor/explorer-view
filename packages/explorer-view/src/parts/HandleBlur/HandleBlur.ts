import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'

export const handleBlur = (state: ExplorerState): ExplorerState => {
  // TODO when blur event occurs because of context menu, focused index should stay the same
  // but focus outline should be removed
  const { editingType } = state
  if (editingType !== ExplorerEditingType.None) {
    return state
  }
  return {
    ...state,
    focused: false,
  }
}
