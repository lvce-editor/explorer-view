import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as GetChevronType from '../GetChevronType/GetChevronType.ts'
import * as GetExpandedType from '../GetExpandedType/GetExpandedType.ts'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.ts'

export const getVisibleExplorerItems = (
  items: readonly any[],
  minLineY: number,
  maxLineY: number,
  focusedIndex: number,
  editingIndex: number,
  editingType: number,
  editingValue: string,
  icons: readonly string[],
  useChevrons: boolean,
): readonly VisibleExplorerItem[] => {
  const visible: VisibleExplorerItem[] = []
  let iconIndex = 0
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    const icon = icons[iconIndex++]
    const indent = GetTreeItemIndent.getTreeItemIndent(item.depth)
    const isFocused = i === focusedIndex
    const id = isFocused ? 'TreeItemActive' : undefined
    const className = isFocused ? ClassNames.TreeItem + ' ' + ClassNames.TreeItemActive : ClassNames.TreeItem

    visible.push({
      ...item,
      isFocused: i === focusedIndex,
      isEditing: i === editingIndex,
      icon,
      useChevrons,
      indent,
      expanded: GetExpandedType.getExpandedType(item.type),
      chevron: GetChevronType.getChevronType(item.type, useChevrons),
      id,
      className,
    })
  }
  if (editingType !== ExplorerEditingType.None && editingIndex === -1) {
    visible.push({
      depth: 3,
      posInSet: 1,
      setSize: 1,
      icon: '',
      isFocused: false,
      name: 'new',
      path: '/test/new',
      type: 2,
      isEditing: true,
      useChevrons,
      indent: '',
      expanded: 0,
      chevron: 0,
      id: undefined,
      className: ClassNames.TreeItem,
    })
  }
  return visible
}
