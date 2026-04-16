import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleBlur = async (state: ExplorerState): Promise<ExplorerState> => {
  console.log('handleBlur', { focusedIndex: state.focusedIndex, focused: state.focused })
  // TODO when blur event occurs because of context menu, focused index should stay the same
  // but focus outline should be removed
  const { items } = state
  const newItems = items.map((item) => {
    return {
      ...item,
      selected: false,
    }
  })
  return {
    ...state,
    focused: false,
    items: newItems,
  }
}
