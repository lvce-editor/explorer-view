import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const handleBlur = (state: ExplorerState): Promise<ExplorerState> => {
  // TODO when blur event occurs because of context menu, focused index should stay the same
  // but focus outline should be removed
  const { items } = state
  const newItems = items.map((item) => {
    return {
      ...item,
      selected: false,
    }
  })
  return Promise.resolve({
    ...state,
    focus: FocusId.None,
    focused: false,
    items: newItems,
  })
}
