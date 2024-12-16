import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { getIndexFromPosition } from '../GetIndexFromPosition/GetIndexFromPosition.ts'

const isEqual = (a: any, b: any): boolean => {
  if (a.length !== b.length) {
    return false
  }
  const length = a.length
  for (let i = 0; i < length; i++) {
    if (a[i] !== b[i]) {
      return false
    }
  }
  return true
}

const canBeDroppedInto = (dirent: any): boolean => {
  if (!dirent) {
    return false
  }
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      return true
    default:
      return false
  }
}

const getNewDropTargets = (state: any, x: number, y: number): readonly any[] => {
  const { items } = state
  const index = getIndexFromPosition(state, x, y)
  if (index === -1) {
    return [-1]
  }
  const item = items[index]
  if (!canBeDroppedInto(item)) {
    return []
  }
  const newDropTargets = [index]
  return newDropTargets
}

export const handleDragOver = (state: any, x: number, y: number): any => {
  Assert.number(x)
  Assert.number(y)
  const { dropTargets } = state
  const newDropTargets = getNewDropTargets(state, x, y)
  if (isEqual(dropTargets, newDropTargets)) {
    return state
  }
  return {
    ...state,
    dropTargets: newDropTargets,
  }
}
