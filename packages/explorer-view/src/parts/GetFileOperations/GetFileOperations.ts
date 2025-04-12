export const getFileOperations = (uploadTree: any): Array<{ type: 'createFolder' | 'createFile'; path: string; text?: string }> => {
  const operations: Array<{ type: 'createFolder' | 'createFile'; path: string; text?: string }> = []

  const processTree = (tree: any, currentPath: string): void => {
    for (const [path, value] of Object.entries(tree)) {
      if (typeof value === 'object') {
        operations.push({ type: 'createFolder', path })
        processTree(value, path)
      } else {
        operations.push({ type: 'createFile', path, text: value as string })
      }
    }
  }

  processTree(uploadTree, '')
  return operations
}
