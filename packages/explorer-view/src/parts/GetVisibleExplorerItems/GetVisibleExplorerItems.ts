import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.ts'
import * as ExpandedType from '../ExpandedType/ExpandedType.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ChevronType from '../ChevronType/ChevronType.ts'

const getExpandedType = (type: number): number => {
  switch (type) {
    case DirentType.Directory:
      return ExpandedType.Collapsed
    case DirentType.DirectoryExpanding:
    case DirentType.DirectoryExpanded:
      return ExpandedType.Expanded
    default:
      return ExpandedType.None
  }
}

const getChevronType = (type: number, useChevrons: boolean): number => {
  if (!useChevrons) {
    return ChevronType.None
  }
  switch (type) {
    case DirentType.Directory:
      return ChevronType.Right
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      return ChevronType.Down
    default:
      return ChevronType.None
  }
}

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
    visible.push({
      ...item,
      isFocused: i === focusedIndex,
      isEditing: i === editingIndex,
      icon,
      useChevrons,
      indent,
      expanded: getExpandedType(item.type),
      chevron: getChevronType(item.type, useChevrons),
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
    })
  }
  return visible
}
