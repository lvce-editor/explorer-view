import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const handleClickFile = async (state: ExplorerState, dirent: any, index: number, keepFocus = false): Promise<any> => {
  await ParentRpc.invoke(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ dirent.path, /* focus */ !keepFocus)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}
