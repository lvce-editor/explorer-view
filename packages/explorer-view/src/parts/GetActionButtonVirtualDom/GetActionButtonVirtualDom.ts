import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetIconVirtualDom from '../GetIconVirtualDom/GetIconVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getActionButtonVirtualDom = (action: any): any => {
  const { id, icon, command } = action
  return [
    {
      type: VirtualDomElements.Button,
      className: ClassNames.IconButton,
      title: id,
      'data-command': command,
      childCount: 1,
    },
    GetIconVirtualDom.getIconVirtualDom(icon),
  ]
}
