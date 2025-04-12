import type { FileOperation } from '../FileOperation/FileOperation.ts'

export const getFileOperations = (root: string, uploadTree: any): readonly FileOperation[] => {
  const operations: FileOperation[] = []

  const processTree = (tree: any, currentPath: string): void => {
    for (const [path, value] of Object.entries(tree)) {
      const fullPath = currentPath ? `${currentPath}/${path}` : path
      if (typeof value === 'object') {
        operations.push({ type: 'createFolder', path: `${root}/${fullPath}`, text: '' })
        processTree(value, fullPath)
      } else if (typeof value === 'string') {
        operations.push({ type: 'createFile', path: `${root}/${fullPath}`, text: value })
      }
    }
  }

  processTree(uploadTree, '')
  return operations
}
