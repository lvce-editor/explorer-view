import type { Settings } from '../Settings/Settings.ts'
import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const getSettings = async (): Promise<Settings> => {
  // TODO get all settings at once
  const useChevronsRaw = await RendererWorker.invoke('Preferences.get', 'explorer.useChevrons')
  const useChevrons = useChevronsRaw === false ? false : true
  const confirmDeleteRaw = await RendererWorker.invoke('Preferences.get', 'explorer.confirmdelete')
  const confirmDelete = confirmDeleteRaw === false ? false : false
  const confirmPasteRaw = await RendererWorker.invoke('Preferences.get', 'explorer.confirmpaste')
  const confirmPaste = confirmPasteRaw === false ? false : false
  return {
    useChevrons,
    confirmDelete,
    confirmPaste,
  }
}
