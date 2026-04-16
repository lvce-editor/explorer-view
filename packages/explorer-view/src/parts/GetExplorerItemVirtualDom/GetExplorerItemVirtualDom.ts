import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as GetInputDom from '../GetInputDom/GetInputDom.ts'
import * as GetLabelDom from '../GetLabelDom/GetLabelDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const getTitle = (path: string): string => {
  if (path.startsWith('file://')) {
    return path.slice('file://'.length)
  }
  return path
}

const withoutTreeItemActive = (className: string): string => {
  return className
    .split(' ')
    .filter((part) => part && part !== ClassNames.TreeItemActive)
    .join(' ')
}

const getClassName = (className: string, selected: boolean, isFocused: boolean): string => {
  const withoutActive = withoutTreeItemActive(className)
  if (selected || isFocused) {
    const parts = withoutActive.split(' ').filter(Boolean)
    if (parts[0] === ClassNames.TreeItem) {
      return [ClassNames.TreeItem, ClassNames.TreeItemActive, ...parts.slice(1)].join(' ')
    }
    return [ClassNames.TreeItemActive, ...parts].join(' ')
  }
  return withoutActive
}

export const getExplorerItemVirtualDom = (item: VisibleExplorerItem, focusedIndex: number): readonly VirtualDomNode[] => {
  const { ariaExpanded, chevron, className, depth, hasEditingError, icon, index, isCut, isEditing, isIgnored, name, path, posInSet, setSize } = item
  const isFocused = index === focusedIndex
  const chevronDom = GetChevronVirtualDom.getChevronVirtualDom(chevron)
  return [
    {
      ariaDescription: '',
      ariaExpanded,
      ariaLabel: name,
      ariaLevel: depth,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      childCount: 2 + chevronDom.length,
      className: getClassName(className, item.selected, isFocused),
      'data-index': index,
      draggable: true,
      id: isFocused ? 'TreeItemActive' : undefined,
      role: AriaRoles.TreeItem,
      title: getTitle(path),
      type: VirtualDomElements.Div,
    },
    ...chevronDom,
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    ...GetInputDom.getInputDom(isEditing, hasEditingError),
    ...GetLabelDom.getLabelDom(isEditing, name, isCut || isIgnored),
  ]
}
