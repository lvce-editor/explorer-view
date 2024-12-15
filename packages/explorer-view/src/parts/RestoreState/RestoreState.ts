import * as GetSavedRoot from '../GetSavedRoot/GetSavedRoot.ts'

export const restoreState = (savedState: any): any => {
  if (!savedState) {
    return {
      minLineY: 0,
      deltaY: 0,
    }
  }
  const root = GetSavedRoot.getSavedRoot(savedState, savedState.workspacePath || '')
  let minLineY = 0
  if (savedState && typeof savedState.minLineY === 'number') {
    minLineY = savedState.minLineY
  }
  let deltaY = 0
  if (savedState && typeof savedState.deltaY === 'number') {
    deltaY = savedState.deltaY
  }
  return {
    ...savedState,
    root,
    minLineY,
    deltaY,
  }
}
