import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as IconThemeWorker from '@lvce-editor/rpc-registry'

export const getEditingIcon = async (editingType: number, value: string, direntType?: number): Promise<string> => {
  if (editingType === ExplorerEditingType.CreateFile) {
    // @ts-ignore
    return IconThemeWorker.invoke('IconTheme.getFileIcon', { name: value })
  }
  if (editingType === ExplorerEditingType.Rename) {
    if (direntType === DirentType.File || direntType === DirentType.EditingFile) {
      // @ts-ignore
      return IconThemeWorker.invoke('IconTheme.getFileIcon', { name: value })
    }
    if (direntType === DirentType.Directory || direntType === DirentType.EditingFolder || direntType === DirentType.EditingDirectoryExpanded) {
      // @ts-ignore
      return IconThemeWorker.invoke('IconTheme.getFolderIcon', { name: value })
    }
  }
  if (editingType === ExplorerEditingType.CreateFolder) {
    // @ts-ignore
    return IconThemeWorker.invoke('IconTheme.getFolderIcon', { name: value })
  }
  return ''
}
