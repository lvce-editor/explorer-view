import type { SavedState } from '../SavedState/SavedState.ts'
import * as Assert from '../Assert/Assert.ts'
import * as ExplorerStates from '../ExplorerStates/ExplorerStates.ts'
import * as GetPath from '../GetPath/GetPath.ts'
import * as IsExpandedDirectory from '../IsExpandedDirectory/IsExpandedDirectory.ts'

export const saveState = (uid: number): SavedState => {
  Assert.number(uid)
  const value = ExplorerStates.get(uid)
  const { newState } = value
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
