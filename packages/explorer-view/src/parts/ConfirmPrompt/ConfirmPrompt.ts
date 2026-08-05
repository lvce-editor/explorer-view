import { DialogWorker, RendererWorker } from '@lvce-editor/rpc-registry'

const missingDialogWorkerRelay = 'Command "SendMessagePortToExtensionHostWorker.sendMessagePortToDialogWorker" not found'

const state = {
  isTest: false,
}

export const setIsTest = (value: boolean): void => {
  state.isTest = value
}

export const confirm = async (message: string): Promise<boolean> => {
  const { isTest } = state
  if (isTest) {
    return RendererWorker.confirm(message)
  }
  try {
    return await DialogWorker.invoke('ConfirmPrompt.prompt', message, undefined)
  } catch (error) {
    if (!String(error).includes(missingDialogWorkerRelay)) {
      throw error
    }
    return RendererWorker.confirm(message)
  }
}
