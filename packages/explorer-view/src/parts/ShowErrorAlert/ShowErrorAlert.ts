import { DialogWorker } from '@lvce-editor/rpc-registry'

export const showErrorAlert = async (errorMessage: string): Promise<void> => {
  await DialogWorker.invoke('ConfirmPrompt.prompt', errorMessage, undefined)
}
