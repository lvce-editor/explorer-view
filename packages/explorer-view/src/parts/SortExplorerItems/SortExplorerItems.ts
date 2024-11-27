import * as Compare from '../Compare/Compare.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const getIndexFromPosition = (state: any, eventX: number, eventY: number): number => {
  const { y, itemHeight, items } = state
  const index = Math.floor((eventY - y) / itemHeight)
  if (index < 0) {
    return 0
  }
  if (index >= items.length) {
    return -1
  }
  return index
}

const priorityMapFoldersFirst: any = {
  [DirentType.Directory]: 1,
  [DirentType.SymLinkFolder]: 1,
  [DirentType.File]: 0,
  [DirentType.SymLinkFile]: 0,
  [DirentType.Unknown]: 0,
  [DirentType.Socket]: 0,
}

const compareDirentType = (direntA: any, direntB: any): any => {
  return priorityMapFoldersFirst[direntB.type] - priorityMapFoldersFirst[direntA.type]
}

const compareDirentName = (direntA: any, direntB: any): number => {
  return Compare.compareStringNumeric(direntA.name, direntB.name)
}

export const compareDirent = (direntA: any, direntB: any): number => {
  return compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
}

export const sortExplorerItems = (rawDirents: any): void => {
  rawDirents.sort(compareDirent)
}
