import type { RestoredState } from '../RestoredState/RestoredState.ts'
import { hasProperty } from '../HasProperty/HasProperty.ts'

const getSavedMinLineY = (savedState: unknown): number => {
  if (hasProperty(savedState, 'minLineY') && typeof savedState.minLineY === 'number') {
    return savedState.minLineY
  }
  return 0
}
const getSavedDeltaY = (savedState: unknown): number => {
  if (hasProperty(savedState, 'deltaY') && typeof savedState.deltaY === 'number') {
    return savedState.deltaY
  }
  return 0
}

const getSavedWorkspacePath = (savedState: unknown): string => {
  if (hasProperty(savedState, 'workspacePath') && typeof savedState.workspacePath === 'string') {
    return savedState.workspacePath
  }
  return ''
}

export const restoreState = (savedState: unknown): RestoredState => {
  if (!savedState) {
    return {
      root: '',
      minLineY: 0,
      deltaY: 0,
    }
  }

  const root = getSavedWorkspacePath(savedState)
  const minLineY = getSavedMinLineY(savedState)
  const deltaY = getSavedDeltaY(savedState)
  return {
    root,
    minLineY,
    deltaY,
  }
}
