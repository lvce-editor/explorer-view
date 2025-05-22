import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const validateFileName2 = (name: string): string => {
  if (!name) {
    const editingErrorMessage = ExplorerStrings.fileOrFolderNameMustBeProvided()
    return editingErrorMessage
  }
  return ''
}
