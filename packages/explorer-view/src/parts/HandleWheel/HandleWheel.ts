import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as SetDeltaY from '../SetDeltaY/SetDeltaY.ts'

export const handleWheel = (state: ExplorerState, deltaMode: any, deltaY: any): any => {
  return SetDeltaY.setDeltaY(state, state.deltaY + deltaY)
}
