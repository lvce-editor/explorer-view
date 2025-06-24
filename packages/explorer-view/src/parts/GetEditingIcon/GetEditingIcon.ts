import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as Rpc from '../RendererWorker/RendererWorker.ts'

export const getEditingIcon = async (editingType: number, value: string, direntType?: number): Promise<string> => {
  if (editingType === ExplorerEditingType.CreateFile) {
    return Rpc.invoke('IconTheme.getFileIcon', { name: value })
  }
  if (editingType === ExplorerEditingType.Rename) {
    if (direntType === DirentType.File || direntType === DirentType.EditingFile) {
      return Rpc.invoke('IconTheme.getFileIcon', { name: value })
    }
    if (direntType === DirentType.Directory || direntType === DirentType.EditingFolder || direntType === DirentType.EditingDirectoryExpanded) {
      return Rpc.invoke('IconTheme.getFolderIcon', { name: value })
    }
  }
  if (editingType === ExplorerEditingType.CreateFolder) {
    return Rpc.invoke('IconTheme.getFolderIcon', { name: value })
  }
  return ''
}
