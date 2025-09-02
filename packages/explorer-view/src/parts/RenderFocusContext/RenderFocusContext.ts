import { WhenExpression } from '@lvce-editor/constants'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'

export const renderFocusContext = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  if (newState.focus === FocusId.Input) {
    return ['Viewlet.setFocusContext', WhenExpression.FocusExplorerEditBox]
  }
  if (newState.focus === FocusId.List) {
    return ['Viewlet.setFocusContext', WhenExpression.FocusExplorer]
  }
  return []
}
