import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const confirmPaste = async (isTest: boolean = false): Promise<boolean> => {
  const result = await ConfirmPrompt.confirm(ExplorerStrings.pasteConfirmation(), isTest)
  return result
}
