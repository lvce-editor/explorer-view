import { DialogWorker } from '@lvce-editor/rpc-registry'

export const confirmDelete = async (paths: readonly string[]): Promise<boolean> => {
  // TODO use i18n string
  const message = paths.length === 1 ? `Are you sure you want to delete "${paths[0]}"?` : `Are you sure you want to delete ${paths.length} items?`
  const result = await DialogWorker.invoke('ConfirmPrompt.prompt', message, undefined)
  return result
}
