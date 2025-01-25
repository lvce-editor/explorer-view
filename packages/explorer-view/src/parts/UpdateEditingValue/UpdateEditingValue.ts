import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as IconTheme from '../IconTheme/IconTheme.ts'

export const updateEditingValue = (state: ExplorerState, value: string): ExplorerState => {
  const editingIcon = IconTheme.getFileIcon({ name: value })
  return {
    ...state,
    editingValue: value,
    editingIcon,
  }
}
