import * as AriaRoles from '../AriaRoles/AriaRoles.ts'
import * as ClassNames from '../ClassNames/ClassNames.ts'
import * as GetActionVirtualDom from '../GetActionVirtualDom/GetActionVirtualDom.ts'
import * as VirtualDomElements from '../VirtualDomElements/VirtualDomElements.ts'

export const getActionsVirtualDom = (actions: any): any => {
  return [
    {
      type: VirtualDomElements.Div,
      className: ClassNames.Actions,
      role: AriaRoles.ToolBar,
      childCount: actions.length,
    },
    ...actions.flatMap(GetActionVirtualDom.getActionVirtualDom),
  ]
}
