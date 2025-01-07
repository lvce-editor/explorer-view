export const getParentEndIndex = (dirents: any, index: number): number => {
  const dirent = dirents[index]
  let endIndex = index + 1
  while (endIndex < dirents.length && dirents[endIndex].depth > dirent.depth) {
    endIndex++
  }
  return endIndex
}
