import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import { RendererWorker } from '@lvce-editor/rpc-registry'

export const confirmPaste = async (): Promise<boolean> => {
  const result = await RendererWorker.confirm(ExplorerStrings.pasteConfirmation())
  return result === true
}
