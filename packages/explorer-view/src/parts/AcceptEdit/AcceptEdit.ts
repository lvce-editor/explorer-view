import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { acceptCreateFile } from '../AcceptCreateFile/AcceptCreateFile.ts'
import { acceptCreateFolder } from '../AcceptCreateFolder/AcceptCreateFolder.ts'
import { acceptRename } from '../AcceptRename/AcceptRename.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as InputSource from '../InputSource/InputSource.ts'

export const acceptEdit = async (state: ExplorerState, inputSource: number = InputSource.Script): Promise<ExplorerState> => {
  if (state.isReadonly) {
    return state
  }
  const { editingType } = state
  let newState: ExplorerState
  switch (editingType) {
    case ExplorerEditingType.CreateFile:
      newState = await acceptCreateFile(state)
      break
    case ExplorerEditingType.CreateFolder:
      newState = await acceptCreateFolder(state)
      break
    case ExplorerEditingType.Rename:
      newState = await acceptRename(state)
      break
    default:
      return state
  }
  return {
    ...newState,
    inputSource: state.inputSource === InputSource.User ? inputSource : state.inputSource,
  }
}
