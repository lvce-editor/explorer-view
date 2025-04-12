import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import { getTopLevelDirents } from '../GetTopLevelDirents/GetTopLevelDirents.ts'
import { mergeDirents } from '../MergeDirents/MergeDirents.ts'

// TODO add lots of tests for this
export const refresh = async (state1: ExplorerState): Promise<ExplorerState> => {
  const topLevelDirents = await getTopLevelDirents(state1.root, state1.pathSeparator, [])
  const newDirents = mergeDirents(state1.items, topLevelDirents)
  const state3 = {
    ...state1,
    items: newDirents,
  }
  return state3
}
