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

const getSavedRoot = (savedState: unknown): string => {
  if (hasProperty(savedState, 'root') && typeof savedState.root === 'string' && URL.canParse(savedState.root)) {
    return savedState.root
  }
  return ''
}

export const restoreState = (savedState: unknown): RestoredState => {
  if (!savedState) {
    return {
      deltaY: 0,
      minLineY: 0,
      root: '',
    }
  }

  const root = getSavedRoot(savedState)
  const minLineY = getSavedMinLineY(savedState)
  const deltaY = getSavedDeltaY(savedState)
  return {
    deltaY,
    minLineY,
    root,
  }
}
