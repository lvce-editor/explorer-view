import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handleBlur = async (state: ExplorerState): Promise<ExplorerState> => {
  // TODO when blur event occurs because of context menu, focused index should stay the same
  // but focus outline should be removed
  return {
    ...state,
    focused: false,
  }
}
