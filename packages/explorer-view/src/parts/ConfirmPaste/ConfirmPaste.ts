import { DialogWorker } from '@lvce-editor/rpc-registry'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'

export const confirmPaste = async (): Promise<boolean> => {
  const result = await DialogWorker.invoke('ConfirmPrompt.prompt', ExplorerStrings.pasteConfirmation(), undefined)
  return result
}
