import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

export const handleWheel = (state: ExplorerState, deltaMode: number, deltaY: number): Promise<ExplorerState> => {
  const { deltaY: currentDeltaY } = state
  return SetDeltaY.setDeltaY(state, currentDeltaY + deltaY)
}
