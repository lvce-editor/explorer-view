import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import type { VisibleExplorerItem } from '../VisibleExplorerItem/VisibleExplorerItem.ts'
import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as InputName from '../InputName/InputName.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const getInputOrLabelDom = (isEditing: boolean): readonly VirtualDomNode[] => {
  if (isEditing) {
    return [
      {
        type: VirtualDomElements.Input,
        className: ClassNames.InputBox,
        id: 'ExplorerInput',
        onInput: 'handleEditingInput',
        childCount: 0,
        name: InputName.ExplorerInput,
      },
    ]
  }
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Label,
      childCount: 1,
    },
    text(name),
  ]
}

export const getItemVirtualDomFile = (item: VisibleExplorerItem): readonly VirtualDomNode[] => {
  const { posInSet, setSize, icon, name, path, depth, isFocused, isEditing, indent } = item

  let id = undefined
  let className = ClassNames.TreeItem
  // TODO avoid branch
  if (isFocused) {
    id = 'TreeItemActive'
    className += ' ' + ClassNames.TreeItemActive
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
      childCount: 2,
      paddingLeft: indent,
      ariaLabel: name,
      ariaDescription: '',
      id,
    },
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    ...getInputOrLabelDom(isEditing),
  ]

  return dom
}
