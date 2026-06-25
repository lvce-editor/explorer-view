import type { FileOperation } from '../FileOperation/FileOperation.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'

export const getExistingPaths = async (operations: readonly FileOperation[]): Promise<ReadonlySet<string>> => {
  const existingPaths = new Set<string>()
  for (const operation of operations) {
    if (!('path' in operation)) {
      continue
    }
    try {
      await FileSystem.stat(operation.path)
      existingPaths.add(operation.path)
    } catch {
      // Missing paths are expected for create operations.
    }
  }
  return existingPaths
}
