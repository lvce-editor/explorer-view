import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { acceptCreate } from '../AcceptCreate/AcceptCreate.ts'
import { acceptRename } from '../AcceptRename/AcceptRename.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const acceptEdit = async (state: ExplorerState): Promise<ExplorerState> => {
  const { editingType } = state
  switch (editingType) {
    case ExplorerEditingType.CreateFile:
      return acceptCreate(state, DirentType.File, FileSystem.createFile)
    case ExplorerEditingType.CreateFolder:
      return acceptCreate(state, DirentType.Directory, FileSystem.mkdir)
    case ExplorerEditingType.Rename:
      return acceptRename(state)
    default:
      return state
  }
}
