import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const renderEditingIndex = (oldState: ExplorerState, newState: ExplorerState): any => {
  // @ts-ignore
  const { editingIndex, editingType, editingValue } = newState
  return ['focusInput', 'ExplorerInput']
}
