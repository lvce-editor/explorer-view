import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const updateEditingValue = (state: ExplorerState, value: string): ExplorerState => {
  const editingIcon = ''
  return {
    ...state,
    editingValue: value,
    editingIcon,
  }
}
