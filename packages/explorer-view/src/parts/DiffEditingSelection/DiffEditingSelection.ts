import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { Selection } from '../Selection/Selection.ts'

export const diffEditingSelection = (state: ExplorerState, start: number, end: number): Selection | undefined => {
  const { editingSelection } = state
  if (editingSelection.start === start && editingSelection.end === end) {
    return undefined
  }
  return { start, end }
}
