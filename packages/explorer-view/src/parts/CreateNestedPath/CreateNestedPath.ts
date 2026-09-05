import * as FileSystem from '../FileSystem/FileSystem.ts'

export const createNestedPath = async (root: string, path: string, pathSeparator: string, applicationId?: string): Promise<void> => {
  const parts = path.slice(root.length).split(pathSeparator)
  let currentPath = ''
  for (const part of parts) {
    if (!part) continue
    currentPath = currentPath ? `${currentPath}${pathSeparator}${part}` : part
    try {
      await FileSystem.mkdir(`${root}${currentPath}`, applicationId)
    } catch (error) {
      // Ignore error if directory already exists
      if (!(error instanceof Error && error.message.includes('already exists'))) {
        throw error
      }
    }
  }
}
