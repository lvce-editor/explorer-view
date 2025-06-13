import type { Settings } from '../Settings/Settings.ts'
import * as ParentRpc from '../RendererWorker/RendererWorker.ts'

export const getSettings = async (): Promise<Settings> => {
  const useChevronsRaw = await ParentRpc.invoke('Preferences.get', 'explorer.useChevrons')
  const useChevrons = useChevronsRaw === false ? false : true
  return {
    useChevrons,
  }
}
