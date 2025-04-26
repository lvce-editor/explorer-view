import * as FileSystem from '../FileSystem/FileSystem.ts'

export const removePaths = async (paths: readonly string[]): Promise<void> => {
  for (const item of paths) {
    try {
      await FileSystem.remove(item)
    } catch {
      // ignore
    }
  }
}
