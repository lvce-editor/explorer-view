import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'

export const handlePointerUp = (state: ExplorerState): ExplorerState => {
  const { isPointerDown, pointerDownIndex } = state
  if (!isPointerDown && pointerDownIndex === -1) {
    return state
  }
  return {
    ...state,
    isPointerDown: false,
    pointerDownIndex: -1,
  }
}
