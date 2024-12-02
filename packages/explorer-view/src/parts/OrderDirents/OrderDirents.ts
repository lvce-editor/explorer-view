const isTopLevel = (dirent: any): any => {
  return dirent.depth === 1
}

export const orderDirents = (dirents: any): any => {
  if (dirents.length === 0) {
    return dirents
  }
  // const parentMap = Object.create(null)
  // for(const dirent of dirents){
  //   const parentPath = dirent.slice(0, dirent.lastIndexOf('/'))
  //   parentMap[parentPath]||=[]
  //   parentMap[parentPath].push(dirent)
  // }
  const withDeepChildren = (parent: any): any => {
    const children = []
    for (const dirent of dirents) {
      if (dirent.depth === parent.depth + 1 && dirent.path.startsWith(parent.path)) {
        children.push(dirent, ...withDeepChildren(dirent))
      }
    }
    return [parent, ...children]
  }
  const topLevelDirents = dirents.filter(isTopLevel)
  const ordered = topLevelDirents.flatMap(withDeepChildren)
  return ordered
}
