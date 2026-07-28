import { RendererWorker } from '@lvce-editor/rpc-registry'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const confirmDelete = async (items: readonly ExplorerItem[]): Promise<boolean> => {
  // TODO use i18n string
  const message =
    items.length === 1
      ? `Are you sure you want to delete "${items[0].path}"?`
      : `Are you sure you want to delete ${items.map((item) => `"${item.name}"`).join(', ')}?`
  const result = await RendererWorker.confirm(message)
  return result
}
