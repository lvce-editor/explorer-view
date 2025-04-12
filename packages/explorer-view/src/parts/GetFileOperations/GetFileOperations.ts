export interface FileOperation {
  readonly type: 'createFile' | 'createFolder'
  readonly text: string
  readonly path: string
}

export const getFileOperations = (root: string, uploadTree: any): readonly FileOperation[] => {
  const operations: FileOperation[] = []

  const processTree = (tree: any, currentPath: string): void => {
    for (const [path, value] of Object.entries(tree)) {
      if (typeof value === 'object') {
        operations.push({ type: 'createFolder', path: `${root}/${path}`, text: '' })
        processTree(value, path)
      } else if (typeof value === 'string') {
        operations.push({ type: 'createFile', path: `${root}/${path}`, text: value })
      }
    }
  }

  processTree(uploadTree, '')
  return operations
}
