import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const updateEditingValue = (state: ExplorerState, value: string, inputSource: number = InputSource.User): ExplorerState => {
  const editingIcon = ''
  return {
    ...state,
    editingValue: value,
    editingIcon,
  }
}
