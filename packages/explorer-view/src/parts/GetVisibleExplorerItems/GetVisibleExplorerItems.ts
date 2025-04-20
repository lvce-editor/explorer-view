import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as ExplorerEditingType from '../ExplorerEditingType/ExplorerEditingType.ts'
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
): readonly VisibleExplorerItem[] => {
  const visible: VisibleExplorerItem[] = []
  const indentFn = useChevrons ? GetTreeItemIndentWithChevron.getTreeItemIndentWithChevron : GetTreeItemIndent.getTreeItemIndent
  let iconIndex = 0
  for (let i = minLineY; i < Math.min(maxLineY, items.length); i++) {
    const item = items[i]
    const icon = icons[iconIndex++]
    const chevron = GetChevronType.getChevronType(item.type, useChevrons)
    const indent = indentFn(item.depth, chevron)
    const isFocused = i === focusedIndex
    const id = isFocused ? 'TreeItemActive' : undefined
    const isSelected = item.selected
    const className = getClassName(isSelected, isFocused)
    const expanded = GetExpandedType.getExpandedType(item.type)
    const ariaExpanded = ariaExpandedValues[expanded]

    // @ts-ignore
    visible.push({
      ...item,
      isEditing: i === editingIndex,
      hasEditingError: i === editingIndex && Boolean(editingErrorMessage),
      icon,
      indent,
      ariaExpanded,
      chevron,
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
      name: 'new',
      path: '/test/new',
      isEditing: true,
      hasEditingError: Boolean(editingErrorMessage),
      indent: '',
      ariaExpanded: undefined,
      chevron: 0,
      id: undefined,
      className: ClassNames.TreeItem,
      selected: false,
    })
  }
  return visible
}
