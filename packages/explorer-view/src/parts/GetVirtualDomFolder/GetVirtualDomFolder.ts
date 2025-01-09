import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as GetInputOrLabelDom from '../GetInputOrLabelDom/GetInputOrLabelDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

const ariaExpandedValues: (string | undefined)[] = [undefined, 'true', 'false']

export const getItemVirtualDomFolder = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  const { posInSet, setSize, icon, name, path, depth, indent, chevron, expanded, id, className, isEditing } = item
  const chevronDom = GetChevronVirtualDom.getChevronVirtualDom(chevron)
  const ariaExpanded = ariaExpandedValues[expanded]
  const dom: readonly VirtualDomNode[] = [
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
      paddingLeft: indent,
      ariaLabel: name,
      ariaExpanded,
      ariaDescription: '',
      id,
    },
    ...chevronDom,
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    ...GetInputOrLabelDom.getInputOrLabelDom(isEditing, name),
  ]
  return dom
}
