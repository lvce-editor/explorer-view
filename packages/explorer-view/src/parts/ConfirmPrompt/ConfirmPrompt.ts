import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const missingDialogWorkerRelay = 'Command "SendMessagePortToExtensionHostWorker.sendMessagePortToDialogWorker" not found'

export const confirm = async (message: string): Promise<boolean> => {
  try {
    return await DialogWorker.invoke('ConfirmPrompt.prompt', message, undefined)
  } catch (error) {
    if (!String(error).includes(missingDialogWorkerRelay)) {
      throw error
    }
    return RendererWorker.confirm(message)
  }
}
