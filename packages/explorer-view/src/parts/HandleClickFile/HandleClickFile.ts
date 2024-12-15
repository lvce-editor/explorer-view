export const handleClickFile = async (state: any, dirent: any, index: any, keepFocus = false): Promise<any> => {
  // await Command.execute(/* Main.openAbsolutePath */ 'Main.openUri', /* absolutePath */ dirent.path, /* focus */ !keepFocus)
  return {
    ...state,
    focusedIndex: index,
    focused: keepFocus,
  }
}
