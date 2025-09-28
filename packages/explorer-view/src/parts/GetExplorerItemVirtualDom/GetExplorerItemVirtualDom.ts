import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as GetInputDom from '../GetInputDom/GetInputDom.ts'
import * as GetLabelDom from '../GetLabelDom/GetLabelDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getExplorerItemVirtualDom = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  const {
    ariaExpanded,
    chevron,
    className,
    depth,
    hasEditingError,
    icon,
    id,
    indent,
    isEditing,
    name,
    path,
    setSize,
    posInSet,
    isCut,
    isIgnored,
    index,
  } = item
  const chevronDom = GetChevronVirtualDom.getChevronVirtualDom(chevron)
  return [
    {
      type: VirtualDomElements.Div,
      role: AriaRoles.TreeItem,
      className,
      draggable: true,
      title: path,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      ariaLevel: depth,
      childCount: 2 + chevronDom.length,
      ariaLabel: name,
      ariaExpanded,
      ariaDescription: '',
      id,
      'data-index': index,
    },
    ...chevronDom,
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    ...GetInputDom.getInputDom(isEditing, hasEditingError),
    ...GetLabelDom.getLabelDom(isEditing, name, isCut || isIgnored),
  ]
}
