import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as Character from '../Character/Character.ts'

export const validateFileName2 = (name: string): string => {
  if (!name) {
    const editingErrorMessage = ExplorerStrings.fileOrFolderNameMustBeProvided()
    return editingErrorMessage
  }
  if (name.startsWith(Character.Slash)) {
    return ExplorerStrings.fileCannotStartWithSlash()
  }
  if (name.startsWith(Character.BackSlash)) {
    return ExplorerStrings.fileCannotStartWithBackSlash()
  }
  return ''
}
