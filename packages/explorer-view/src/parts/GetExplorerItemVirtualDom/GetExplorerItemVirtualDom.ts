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

export const getExplorerItemVirtualDom = (item: VisibleExplorerItem, editingSessionId = 0): readonly VirtualDomNode[] => {
  const {
    ariaExpanded,
    chevron,
    className,
    depth,
    hasEditingError,
    icon,
    id,
    indent,
    index,
    isCut,
    isEditing,
    isIgnored,
    name,
    path,
    posInSet,
    selected,
    setSize,
  } = item
  const chevronDom = GetChevronVirtualDom.getChevronVirtualDom(chevron)
  const fileIconDom = icon ? [GetFileIconVirtualDom.getFileIconVirtualDom(icon)] : []
  return [
    {
      ariaExpanded,
      ariaLabel: name,
      ariaLevel: depth,
      ariaPosInSet: posInSet,
      ariaSelected: selected ? 'true' : undefined,
      ariaSetSize: setSize,
      childCount: 2 + chevronDom.length,
      className,
      'data-index': index,
      draggable: true,
      id,
      // Keep the item aligned even when the generated indent stylesheet is applied late.
      paddingLeft: indent,
      role: AriaRoles.TreeItem,
      title: getTitle(path),
      type: VirtualDomElements.Div,
    },
    ...chevronDom,
    {
      childCount: fileIconDom.length,
      className: ClassNames.FileIconSlot,
      type: VirtualDomElements.Div,
    },
    ...fileIconDom,
    ...GetInputDom.getInputDom(isEditing, hasEditingError, editingSessionId),
    ...GetLabelDom.getLabelDom(isEditing, name, isCut || isIgnored),
  ]
}
