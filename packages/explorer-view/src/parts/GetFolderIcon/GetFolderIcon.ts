import * as IconThemeWorker from '@lvce-editor/rpc-registry'

export const getFolderIcon = async (name: string): Promise<string> => {
  // @ts-ignore
  return IconThemeWorker.invoke('IconTheme.getFolderIcon', { name })
}
