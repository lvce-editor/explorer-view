import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
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
    if (i === editingIndex) {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        isEditing: true,
        icon,
        useChevrons,
        indent,
      })
    } else {
      visible.push({
        ...item,
        isFocused: i === focusedIndex,
        icon,
        useChevrons,
        indent,
      })
    }
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
    })
  }
  return visible
}
