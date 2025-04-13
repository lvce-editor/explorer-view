import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as FocusId from '../FocusId/FocusId.ts'
import * as InputName from '../InputName/InputName.ts'

export const renderFocus = (oldState: ExplorerState, newState: ExplorerState): readonly any[] => {
  console.log('render focus')
  if (newState.focus === FocusId.Input) {
    return ['Viewlet.focusElementByName', InputName.ExplorerInput]
  }
  // TODO
  // 1. when focused, focus the outer list element
  // 2. when focused, set focus context in renderer worker
  return []
}
