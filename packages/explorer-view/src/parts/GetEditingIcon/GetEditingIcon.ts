import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as Rpc from '../ParentRpc/ParentRpc.ts'

export const getEditingIcon = async (editingType: number, value: string): Promise<string> => {
  if (editingType === ExplorerEditingType.CreateFile) {
    return Rpc.invoke('IconTheme.getFileIcon', { name: value })
  }
  // TODO need renamefile and renamefolder type
  if (editingType === ExplorerEditingType.Rename) {
    return Rpc.invoke('IconTheme.getFileIcon', { name: value })
  }
  if (editingType === ExplorerEditingType.CreateFolder) {
    return Rpc.invoke('IconTheme.getFolderIcon', { name: value })
  }
  return ''
}
