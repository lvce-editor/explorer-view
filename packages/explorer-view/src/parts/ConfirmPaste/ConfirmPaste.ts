import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const confirmPaste = async (): Promise<boolean> => {
  // @ts-ignore
  const result = await RendererWorker.invoke('Confirmprompt.prompt', ExplorerStrings.pasteConfirmation())
  return result === true
}
