export const getFocusedDirent = (state: any): any => {
  const { focusedIndex, minLineY, items } = state
  const dirent = items[focusedIndex + minLineY]
  return dirent
}
