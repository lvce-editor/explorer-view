import { VError } from '@lvce-editor/verror'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Path from '../Path/Path.ts'

export const createNewDirentsRename = async (renamedDirent: ExplorerItem, editingValue: string, pathSeparator: string): Promise<boolean> => {
  try {
    // TODO this does not work with rename of nested file
    const oldAbsolutePath = renamedDirent.path
    const oldParentPath = Path.dirname(pathSeparator, oldAbsolutePath)
    const newAbsolutePath = Path.join2(oldParentPath, editingValue)
    await FileSystem.rename(oldAbsolutePath, newAbsolutePath)
  } catch (error) {
    console.error(new VError(error, `Failed to rename file`))
    return false
  }
  return true
}
