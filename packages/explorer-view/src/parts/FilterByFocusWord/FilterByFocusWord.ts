import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const filterByFocusWord = (items: readonly ExplorerItem[], focusedIndex: number, focusWord: string): number => {
  const matchesWord = (item: ExplorerItem): boolean => {
    return item.name.toLowerCase().startsWith(focusWord)
  }
  const matchingIndex = items.findIndex(matchesWord)
  return matchingIndex
}
