import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const confirmPaste = async (): Promise<boolean> => {
  const result = await RendererWorker.confirm(ExplorerStrings.pasteConfirmation())
  return result === true
}
