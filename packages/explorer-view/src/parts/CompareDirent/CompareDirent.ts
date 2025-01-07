import * as Compare from '../Compare/Compare.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

const priorityMapFoldersFirst: any = {
  [DirentType.Directory]: 1,
  [DirentType.SymLinkFolder]: 1,
  [DirentType.File]: 0,
  [DirentType.SymLinkFile]: 0,
  [DirentType.Unknown]: 0,
  [DirentType.Socket]: 0,
}

const compareDirentType = (direntA: ExplorerItem, direntB: ExplorerItem): any => {
  return priorityMapFoldersFirst[direntB.type] - priorityMapFoldersFirst[direntA.type]
}

const compareDirentName = (direntA: ExplorerItem, direntB: ExplorerItem): number => {
  return Compare.compareStringNumeric(direntA.name, direntB.name)
}

export const compareDirent = (direntA: ExplorerItem, direntB: ExplorerItem): number => {
  return compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
}
