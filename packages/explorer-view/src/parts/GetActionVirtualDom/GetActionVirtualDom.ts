import * as ActionType from '../ActionType/ActionType.ts'
import * as GetActionButtonVirtualDom from '../GetActionButtonVirtualDom/GetActionButtonVirtualDom.ts'

export const getActionVirtualDom = (action: any): any => {
  switch (action.type) {
    case ActionType.Button:
      return GetActionButtonVirtualDom.getActionButtonVirtualDom(action)
    default:
      return []
  }
}
