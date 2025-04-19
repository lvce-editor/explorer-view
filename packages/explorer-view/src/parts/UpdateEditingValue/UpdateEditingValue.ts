import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import * as Rpc from '../ParentRpc/ParentRpc.ts'

const getEditingIcon = async (editingType: number, value: string): Promise<string> => {
  if (editingType === DirentType.File) {
    return Rpc.invoke('IconTheme.getFileIcon', { name: value })
  }
  if (editingType === DirentType.Directory) {
    return Rpc.invoke('IconTheme.getFolderIcon', { name: value })
  }
  return ''
}

export const updateEditingValue = async (state: ExplorerState, value: string, inputSource: number = InputSource.User): Promise<ExplorerState> => {
  const editingIcon = await getEditingIcon(state.editingType, value)
  return {
    ...state,
    editingValue: value,
    editingIcon,
  }
}
