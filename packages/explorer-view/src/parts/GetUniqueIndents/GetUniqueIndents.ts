import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import { getIndentFromClassName } from '../GetIndentFromClassName/GetIndentFromClassName.ts'
import { getUnique } from '../GetUnique/GetUnique.ts'

const getIndent = (item: VisibleExplorerItem): number => getIndentFromClassName(item.className)

export const getUniqueIndents = (items: readonly VisibleExplorerItem[]): readonly number[] => {
  const indents = items.map(getIndent)
  const uniqueIndents = getUnique(indents)
  return uniqueIndents
}
