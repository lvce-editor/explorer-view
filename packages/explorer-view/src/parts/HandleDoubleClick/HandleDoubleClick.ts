import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'
import { newFile } from '../NewFile/NewFile.ts'
import { normalizeDirentType } from '../NormalizeDirentType/NormalizeDirentType.ts'
import * as OpenUri from '../OpenUri/OpenUri.ts'

export const handleDoubleClick = async (state: ExplorerState, eventX: number, eventY: number): Promise<ExplorerState> => {
  const index = getIndexFromPosition(state, eventX, eventY)
  if (index === -1) {
    return newFile(state)
  }
  const item = state.items[index]
  const type = normalizeDirentType(item.type)
  if (type === DirentType.File || type === DirentType.SymLinkFile) {
    await OpenUri.openUri(item.path, true)
  }
  return state
}
