export const getIndex = (dirents: any, uri: string): number => {
  for (let i = 0; i < dirents.length; i++) {
    const dirent = dirents[i]
    if (dirent.path === uri) {
      return i
    }
  }
  return -1
}
