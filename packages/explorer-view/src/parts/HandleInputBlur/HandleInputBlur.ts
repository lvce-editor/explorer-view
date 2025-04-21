import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as CancelEdit from '../CancelEdit/CancelEdit.ts'

export const handleInputBlur = (state: ExplorerState): ExplorerState => {
  return CancelEdit.cancelEdit(state)
}
