import * as ViewletExplorerActions from '../GetActions/GetActions.ts'
import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.ts'

export const renderActions = (state: any): any => {
  const actions = ViewletExplorerActions.getActions(state.root)
  const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
  return dom
}
