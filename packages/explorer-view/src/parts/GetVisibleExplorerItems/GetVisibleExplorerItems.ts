import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetChevronType from '../GetChevronType/GetChevronType.ts'
import * as GetExpandedType from '../GetExpandedType/GetExpandedType.ts'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.ts'
import * as GetTreeItemIndentWithChevron from '../GetTreeItemIndentWithChevron/GetTreeItemIndentWithChevron.ts'
import * as MergeClassNames from '../MergeClassNames/MergeClassNames.ts'

const ariaExpandedValues: (string | undefined)[] = [undefined, 'true', 'false']

const getClassName = (isSelected: boolean, isFocused: boolean): string => {
  if (isFocused) {
    return MergeClassNames.mergeClassNames(ClassNames.TreeItem, ClassNames.TreeItemActive)
  }
  if (isSelected) {
    return MergeClassNames.mergeClassNames(ClassNames.TreeItem, ClassNames.TreeItemActive)
  }
  return ClassNames.TreeItem
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
    const chevron = GetChevronType.getChevronType(item.type, useChevrons)
    const indent = indentFn(item.depth, chevron)
    const isFocused = i === focusedIndex
    const id = isFocused ? 'TreeItemActive' : undefined
    const isSelected = item.selected
    const className = getClassName(isSelected, isFocused)
    const expanded = GetExpandedType.getExpandedType(item.type)
    const ariaExpanded = ariaExpandedValues[expanded]
    const isEditing = i === editingIndex
    let icon = icons[iconIndex++]
    if (isEditing) {
      icon = editingIcon
    }

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
