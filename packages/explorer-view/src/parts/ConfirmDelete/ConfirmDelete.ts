import * as RendererWorker from '../RendererWorker/RendererWorker.ts'

export const confirmDelete = async (paths: readonly string[]): Promise<boolean> => {
  // TODO use i18n string
  const message = paths.length === 1 ? `Are you sure you want to delete "${paths[0]}"?` : `Are you sure you want to delete ${paths.length} items?`
  // @ts-ignore
  const result = await RendererWorker.confirm(message)
  return result === true
}
