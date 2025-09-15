import * as IconThemeWorker from '../IconThemeWorker/IconThemeWorker.ts'

export const getFolderIcon = async (name: string): Promise<string> => {
  // @ts-ignore
  return IconThemeWorker.invoke('IconTheme.getFolderIcon', { name })
}
