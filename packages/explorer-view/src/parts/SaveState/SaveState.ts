import type { ExplorerState } from '../EXplorerState/ExplorerState.ts'
import type { SavedState } from '../SavedState/SavedState.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as GetPath from '../GetPath/GetPath.ts'
import * as IsExpandedDirectory from '../IsExpandedDirectory/IsExpandedDirectory.ts'

export const saveState = (uid: number): SavedState => {
  let newState: ExplorerState
  if (typeof uid === 'number') {
    const value = ExplorerStates.get(uid)
    newState = value.newState
  } else {
    // deprecated
    newState = uid
  }
  const { items, root, deltaY, minLineY, maxLineY } = newState
  const expandedPaths = items.filter(IsExpandedDirectory.isExpandedDirectory).map(GetPath.getPath)
  return {
    expandedPaths,
    root,
    minLineY,
    maxLineY,
    deltaY,
  }
}
