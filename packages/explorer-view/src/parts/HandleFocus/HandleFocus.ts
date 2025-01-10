import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import * as Focus from '../Focus/Focus.ts'
import * as WhenExpression from '../WhenExpression/WhenExpression.ts'

export const handleFocus = async (state: ExplorerState): Promise<ExplorerState> => {
  await Focus.setFocus(WhenExpression.FocusExplorer)
  return state
}
