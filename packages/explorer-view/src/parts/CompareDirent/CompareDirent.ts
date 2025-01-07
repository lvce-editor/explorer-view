import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as Compare from '../Compare/Compare.ts'
import * as DirentType from '../DirentType/DirentType.ts'

const priorityMapFoldersFirst: Record<number, number> = {
  [DirentType.Directory]: 1,
  [DirentType.SymLinkFolder]: 1,
  [DirentType.File]: 0,
  [DirentType.SymLinkFile]: 0,
  [DirentType.Unknown]: 0,
  [DirentType.Socket]: 0,
}

const compareDirentType = (direntA: ExplorerItem, direntB: ExplorerItem): number => {
  return priorityMapFoldersFirst[direntB.type] - priorityMapFoldersFirst[direntA.type]
}

const compareDirentName = (direntA: ExplorerItem, direntB: ExplorerItem): number => {
  return Compare.compareStringNumeric(direntA.name, direntB.name)
}

export const compareDirent = (direntA: ExplorerItem, direntB: ExplorerItem): number => {
  return compareDirentType(direntA, direntB) || compareDirentName(direntA, direntB)
}
