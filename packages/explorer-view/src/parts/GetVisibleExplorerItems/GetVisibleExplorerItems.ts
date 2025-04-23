import * as ChevronType from '../ChevronType/ChevronType.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as GetChevronType from '../GetChevronType/GetChevronType.ts'
import * as GetExpandedType from '../GetExpandedType/GetExpandedType.ts'
import { getTreeItemClassName } from '../GetTreeItemClassName/GetTreeItemClassName.ts'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.ts'
import * as GetTreeItemIndentWithChevron from '../GetTreeItemIndentWithChevron/GetTreeItemIndentWithChevron.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'

const ariaExpandedValues: (string | undefined)[] = [undefined, 'true', 'false']

const getEditingChevron = (direntType: number): number => {
  switch (direntType) {
    case DirentType.EditingDirectoryExpanded:
      return ChevronType.Down
    case DirentType.EditingFolder:
      return ChevronType.Right
    default:
      return ChevronType.None
  }
}

export const getVisibleExplorerItems = (
  items: readonly ExplorerItem[],
  minLineY: number,
  maxLineY: number,
  focusedIndex: number,
  editingIndex: number,
  editingType: number,
  editingValue: string,
  editingErrorMessage: string,
  icons: readonly string[],
  useChevrons: boolean,
  dropTargets: readonly number[],
  editingIcon: string,
): readonly VisibleExplorerItem[] => {
  const visible: VisibleExplorerItem[] = []
  const indentFn = useChevrons ? GetTreeItemIndentWithChevron.getTreeItemIndentWithChevron : GetTreeItemIndent.getTreeItemIndent
  let iconIndex = 0
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    let chevron = GetChevronType.getChevronType(item.type, useChevrons)
    const isFocused = i === focusedIndex
    const id = isFocused ? 'TreeItemActive' : undefined
    const isSelected = item.selected
    const className = getTreeItemClassName(isSelected, isFocused)
    const expanded = GetExpandedType.getExpandedType(item.type)
    const ariaExpanded = ariaExpandedValues[expanded]
    const isEditing = i === editingIndex
    let icon = icons[iconIndex++]
    if (isEditing) {
      icon = editingIcon
      chevron = getEditingChevron(item.type)
    }
    const indent = indentFn(item.depth, chevron)

    visible.push({
      ...item,
      posInSet: item.posInSet ?? i + 1,
      setSize: item.setSize ?? items.length,
      isEditing: isEditing,
      hasEditingError: isEditing && Boolean(editingErrorMessage),
      icon,
      indent,
      ariaExpanded,
      chevron,
      id,
      className,
    })
  }
  return visible
}
