export const mergeDirents = (oldDirents: any, newDirents: any): any => {
  const merged = []
  let oldIndex = 0
  for (const newDirent of newDirents) {
    merged.push(newDirent)
    for (let i = oldIndex; i < oldDirents.length; i++) {
      if (oldDirents[i].path === newDirent.path) {
        // TOOD copy children of old dirent
        oldIndex = i
        break
      }
    }
  }
  return merged
}
