import * as Compare from '../Compare/Compare.ts'
import * as DirentType from '../DirentType/DirentType.ts'

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
