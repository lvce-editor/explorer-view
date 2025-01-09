import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const chevronDomNodes: readonly (readonly VirtualDomNode[])[] = [
  [],
  [GetChevronVirtualDom.getChevronRightVirtualDom()],
  [GetChevronVirtualDom.getChevronDownVirtualDom()],
]

const ariaExpandedValues: (string | undefined)[] = [undefined, 'true', 'false']

export const getItemVirtualDomFolder = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  const { posInSet, setSize, icon, name, path, depth, isFocused, indent, chevron, expanded } = item
  const chevronDom = chevronDomNodes[chevron]
  const ariaExpanded = ariaExpandedValues[expanded]
  let id = undefined
  // TODO avoid branch
  if (isFocused) {
    id = 'TreeItemActive'
  }
  const dom: readonly VirtualDomNode[] = [
    {
      type: VirtualDomElements.Div,
      role: AriaRoles.TreeItem,
      className: ClassNames.TreeItem,
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
    },
    ...chevronDom,
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Label,
      childCount: 1,
    },
    text(name),
  ]
  return dom
}
