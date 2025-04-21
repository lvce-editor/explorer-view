import * as DirentType from '../DirentType/DirentType.ts'
import * as Rpc from '../ParentRpc/ParentRpc.ts'

export const getEditingIcon = async (editingType: number, value: string): Promise<string> => {
  if (editingType === DirentType.File) {
    return Rpc.invoke('IconTheme.getFileIcon', { name: value })
  }
  if (editingType === DirentType.Directory) {
    return Rpc.invoke('IconTheme.getFolderIcon', { name: value })
  }
  return ''
}
