import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import * as GetPath from '../GetPath/GetPath.ts'
import * as IsExpandedDirectory from '../IsExpandedDirectory/IsExpandedDirectory.ts'

export const saveState = (state: ExplorerState): SavedState => {
  const { items, root, deltaY, minLineY, maxLineY } = state
  const expandedPaths = items.filter(IsExpandedDirectory.isExpandedDirectory).map(GetPath.getPath)
  return {
    expandedPaths,
    root,
    minLineY,
    maxLineY,
    deltaY,
  }
}
