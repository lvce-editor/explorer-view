import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getEditingIcon } from '../GetEditingIcon/GetEditingIcon.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const updateEditingValue = async (state: ExplorerState, value: string, inputSource: number = InputSource.User): Promise<ExplorerState> => {
  const editingIcon = await getEditingIcon(state.editingType, value)
  return {
    ...state,
    editingValue: value,
    editingIcon,
  }
}
