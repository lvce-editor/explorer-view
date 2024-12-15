export const isTopLevel = (dirent: any): boolean => {
  return dirent.depth === 1
}
