import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as SetFocus from '../SetFocus/SetFocus.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const handleFocus = async (state: ExplorerState): Promise<ExplorerState> => {
  await SetFocus.setFocus(WhenExpression.FocusExplorer)
  return state
}
