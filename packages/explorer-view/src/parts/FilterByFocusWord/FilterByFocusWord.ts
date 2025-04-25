import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const filterByFocusWord = (items: readonly ExplorerItem[], focusWord: string): number => {
  const matchingIndex = items.findIndex((item) => item.name.toLowerCase().startsWith(focusWord))
  return matchingIndex
}
