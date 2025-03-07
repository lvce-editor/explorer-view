import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as GetIndex from '../GetIndex/GetIndex.ts'
import * as RevealItemHidden from '../RevealItemHidden/RevealItemHidden.ts'
import * as RevealItemVisible from '../RevealItemVisible/RevealItemVisible.ts'

export const revealItem = async (state: ExplorerState, uri: string): Promise<ExplorerState> => {
  Assert.object(state)
  Assert.string(uri)
  const { items } = state
  const index = GetIndex.getIndex(items, uri)
  if (index === -1) {
    return RevealItemHidden.revealItemHidden(state, uri)
  }
  return RevealItemVisible.revealItemVisible(state, index)
}
