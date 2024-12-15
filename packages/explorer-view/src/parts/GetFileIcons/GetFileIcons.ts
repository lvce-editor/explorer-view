import * as Rpc from '../ParentRpc/ParentRpc.ts'

const getFileIcon = (file: string): Promise<string> => {
  return Rpc.invoke('IconTheme.getFileIcon', { name: file })
}

export const getFileIcons = async (fileNames: readonly string[]): Promise<readonly string[]> => {
  const promises = fileNames.map(getFileIcon)
  const icons = await Promise.all(promises)
  return icons
}
