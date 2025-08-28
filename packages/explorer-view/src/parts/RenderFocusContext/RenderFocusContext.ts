import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const renderFocusContext = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  if (newState.focus === FocusId.Input) {
    return ['Viewlet.setFocusContext', WhenExpression.FocusExplorerEditBox]
  }
  if (newState.focus === FocusId.List) {
    return ['Viewlet.setFocusContext', WhenExpression.FocusExplorer]
  }
  return []
}
