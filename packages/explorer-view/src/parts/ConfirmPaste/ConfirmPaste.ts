import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const confirmPaste = async (): Promise<boolean> => {
  const result = await ConfirmPrompt.confirm(ExplorerStrings.pasteConfirmation())
  return result
}
