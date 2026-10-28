import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as ConfirmPrompt from '../ConfirmPrompt/ConfirmPrompt.ts'
import * as GetDisplayUri from '../GetDisplayUri/GetDisplayUri.ts'

export const confirmDelete = async (items: readonly ExplorerItem[]): Promise<boolean> => {
  // TODO use i18n string
  const names = items.map((item) => `"${item.name}"`).join(', ')
  const message = items.length === 1 ? `Are you sure you want to delete "${GetDisplayUri.getDisplayUri(items[0].uri)}"?` : `Are you sure you want to delete ${names}?`
  const result = await ConfirmPrompt.confirm(message)
  return result
}
