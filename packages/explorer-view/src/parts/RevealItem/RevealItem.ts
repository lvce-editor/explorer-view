import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as Focus from '../Focus/Focus.ts'
import * as GetIndex from '../GetIndex/GetIndex.ts'
import * as InputSource from '../InputSource/InputSource.ts'
import { isExcluded } from '../IsExcluded/IsExcluded.ts'
import * as IsUriWithinRoot from '../IsUriWithinRoot/IsUriWithinRoot.ts'
import * as RendererProcess from '../RendererProcess/RendererProcess.ts'
import * as RevealItemHidden from '../RevealItemHidden/RevealItemHidden.ts'
import * as RevealItemVisible from '../RevealItemVisible/RevealItemVisible.ts'

export const revealItem = async (state: ExplorerState, uri: string): Promise<ExplorerState> => {
  Assert.object(state)
  Assert.string(uri)
  const { excluded, items, pathSeparator, root, uid } = state
  if (!IsUriWithinRoot.isUriWithinRoot(root, uri, pathSeparator)) {
    return state
  }
  if (isExcluded(root, uri, excluded)) {
    return state
  }
  const index = GetIndex.getIndex(items, uri)
  const revealedState = index === -1 ? await RevealItemHidden.revealItemHidden(state, uri) : RevealItemVisible.revealItemVisible(state, index)
  if (revealedState === state) {
    return state
  }
  if (RendererProcess.isConnected()) {
    RendererProcess.requestPostRenderFocusSelector(uid, '.ListItems')
  }
  return Focus.focus({
    ...revealedState,
    inputSource: InputSource.Script,
  })
}
