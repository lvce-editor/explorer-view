import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChevronVirtualDom from '../GetChevronVirtualDom/GetChevronVirtualDom.ts'
import * as GetFileIconVirtualDom from '../GetFileIconVirtualDom/GetFileIconVirtualDom.ts'
import * as GetTreeItemIndent from '../GetTreeItemIndent/GetTreeItemIndent.ts'
import * as InputName from '../InputName/InputName.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'
import { text } from '../VirtualDomHelpers/VirtualDomHelpers.ts'

const useChevrons = false

const getItemVirtualDomFile = (item: any): any => {
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

const getItemVirtualDomFolder = (item: any): any => {
  const { posInSet, setSize, icon, name, path, depth, type, isFocused } = item
  let ariaExpanded = ''
  let chevron
  switch (type) {
    // TODO decide on directory vs folder
    case DirentType.Directory:
      ariaExpanded = 'false'
      chevron = GetChevronVirtualDom.getChevronRightVirtualDom()
      break
    case DirentType.DirectoryExpanding:
      ariaExpanded = 'true' // TODO tree should be aria-busy then
      chevron = GetChevronVirtualDom.getChevronRightVirtualDom()
      break
    case DirentType.DirectoryExpanded:
      ariaExpanded = 'true'
      chevron = GetChevronVirtualDom.getChevronDownVirtualDom()
      break
    case DirentType.File:
      break
    default:
      break
  }
  const dom = []

  dom.push({
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
    ariaExpanded,
    ariaDescription: '',
  })

  if (useChevrons) {
    dom[0].childCount++
    dom.push(chevron)
  }
  dom.push(
    GetFileIconVirtualDom.getFileIconVirtualDom(icon),
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Label,
      childCount: 1,
    },
    text(name),
  )
  if (isFocused) {
    // @ts-ignore
    dom[0].id = 'TreeItemActive'
  }
  return dom
}

export const getExplorerItemVirtualDom = (item: any): any => {
  const { type } = item
  switch (type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanding:
    case DirentType.DirectoryExpanded:
      return getItemVirtualDomFolder(item)
    default:
      return getItemVirtualDomFile(item)
  }
}
