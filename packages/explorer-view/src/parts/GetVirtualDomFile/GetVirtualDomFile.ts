import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.ts'
import * as InputName from '../InputName/InputName.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

export const getItemVirtualDomFile = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  const { posInSet, setSize, icon, name, path, depth, isFocused, isEditing } = item

  const dom = []

  dom.push(
    {
      type: VirtualDomElements.Div,
      role: AriaRoles.TreeItem,
      className: ClassNames.TreeItem,
      draggable: true,
      title: path,
      ariaPosInSet: posInSet,
      ariaSetSize: setSize,
      ariaLevel: depth,
      childCount: 2,
      paddingLeft: GetTreeItemIndent.getTreeItemIndent(depth),
      ariaLabel: name,
      ariaDescription: '',
    },
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
  )
  if (isEditing) {
    dom.push({
      type: VirtualDomElements.Input,
      className: ClassNames.InputBox,
      id: 'ExplorerInput',
      onInput: 'handleEditingInput',
      childCount: 0,
      name: InputName.ExplorerInput,
    })
  } else {
    dom.push(
      {
        type: VirtualDomElements.Div,
        className: ClassNames.Label,
        childCount: 1,
      },
      text(name),
    )
  }
  if (isFocused) {
    // @ts-ignore
    dom[0].id = 'TreeItemActive'
    // @ts-ignore
    dom[0].className += ' ' + ClassNames.TreeItemActive
  }
  return dom
}
