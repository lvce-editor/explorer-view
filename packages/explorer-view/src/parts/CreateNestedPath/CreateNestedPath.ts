import * as FileSystem from '../FileSystem/FileSystem.ts'

export const createNestedPath = async (path: string, pathSeparator: string): Promise<void> => {
  const parts = path.split(pathSeparator)
  let currentPath = ''
  for (const part of parts) {
    if (!part) continue
    currentPath = currentPath ? `${currentPath}${pathSeparator}${part}` : part
    try {
      await FileSystem.mkdir(currentPath)
    } catch (error) {
      // Ignore error if directory already exists
      if (!(error instanceof Error && error.message.includes('already exists'))) {
        throw error
      }
    }
  }
}
