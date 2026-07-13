import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import { getEditingIcon } from '../GetEditingIcon/GetEditingIcon.ts'
import * as NewDirent from '../NewDirent/NewDirent.ts'

export const newFolder = async (state: ExplorerState): Promise<ExplorerState> => {
  if (state.editingIndex !== -1) {
    return state
  }
  const editingIcon = await getEditingIcon(ExplorerEditingType.CreateFolder, '')
  return NewDirent.newDirent(state, ExplorerEditingType.CreateFolder, editingIcon)
}
