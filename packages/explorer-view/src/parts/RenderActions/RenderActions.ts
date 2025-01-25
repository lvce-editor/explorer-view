import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { VirtualDomNode } from '../VirtualDomNode/VirtualDomNode.ts'
import * as ViewletExplorerActions from '../GetActions/GetActions.ts'
import * as GetActionsVirtualDom from '../GetActionsVirtualDom/GetActionsVirtualDom.ts'

export const renderActions = (state: ExplorerState): readonly VirtualDomNode[] => {
  const actions = ViewletExplorerActions.getActions(state.root)
  const dom = GetActionsVirtualDom.getActionsVirtualDom(actions)
  return dom
}
