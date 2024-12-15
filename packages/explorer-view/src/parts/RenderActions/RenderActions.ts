import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.ts'
import * as ViewletExplorerActions from '../GetActions/GetActions.ts'

export const renderActions = (state: any): any => {
  const actions = ViewletExplorerActions.getActions(state.root)
  const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
  return dom
}
