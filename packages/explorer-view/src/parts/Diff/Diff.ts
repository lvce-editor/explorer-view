import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DiffModules from '../DiffModules/DiffModules.ts'

export const diff = (oldState: ExplorerState, newState: ExplorerState): readonly number[] => {
  const diffResult: number[] = []
  for (const module of DiffModules.modules) {
    if (!module.isEqual(oldState, newState)) {
      diffResult.push(module.diffType)
    }
  }
  return diffResult
}
