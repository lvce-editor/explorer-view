import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { Settings } from '../Settings/Settings.ts'
import { getExcluded } from '../GetExcluded/GetExcluded.ts'

export const getSettings = async (): Promise<Settings> => {
  // TODO don't return false always
  // TODO get all settings at once
  const useChevronsRaw = await RendererWorker.invoke('Preferences.get', 'explorer.useChevrons')
  const useChevrons = useChevronsRaw === false ? false : true
  const confirmDeleteRaw = await RendererWorker.invoke('Preferences.get', 'explorer.confirmdelete')
  const confirmDelete = confirmDeleteRaw === false ? false : true
  const confirmPasteRaw = await RendererWorker.invoke('Preferences.get', 'explorer.confirmpaste')
  const confirmPaste = confirmPasteRaw === false ? false : false
  const excludedRaw = await RendererWorker.invoke('Preferences.get', 'files.exclude')
  const excluded = getExcluded(excludedRaw)
  const gitIgnoreDecorationsRaw = await RendererWorker.invoke('Preferences.get', 'explorer.gitIgnoreDecorations')
  const gitIgnoreDecorations = gitIgnoreDecorationsRaw === false ? false : true
  const sourceControlDecorationsRaw = await RendererWorker.invoke('Preferences.get', 'explorer.sourceControlDecorations')
  const sourceControlDecorations = sourceControlDecorationsRaw === false ? false : true
  return {
    confirmDelete,
    confirmPaste,
    excluded,
    gitIgnoreDecorations,
    sourceControlDecorations,
    useChevrons,
  }
}
