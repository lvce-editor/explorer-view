import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

export const handleClickFile = async (state: any, dirent: any, index: any, keepFocus = false): Promise<any> => {
  await ParentRpc.invoke(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ dirent.path, /* focus */ !keepFocus)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}
