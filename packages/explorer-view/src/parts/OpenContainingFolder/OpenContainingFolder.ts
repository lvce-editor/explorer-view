import * as ParentRpc from '../ParentRpc/ParentRpc.ts'

const getContaingingFolder = (root: string, dirents: readonly any[], focusedIndex: number, pathSeparator: string): string => {
  if (focusedIndex < 0) {
    return root
  }
  const dirent = dirents[focusedIndex]
  const direntPath = dirent.path
  const direntParentPath = direntPath.slice(0, -(dirent.name.length + 1))
  const path = `${direntParentPath}`
  return path
}

export const openContainingFolder = async (state: any): Promise<any> => {
  const { focusedIndex, root, items, pathSeparator } = state
  const path = getContaingingFolder(root, items, focusedIndex, pathSeparator)
  await ParentRpc.invoke('OpenNativeFolder.openNativeFolder', /* path */ path)
  return state
}
