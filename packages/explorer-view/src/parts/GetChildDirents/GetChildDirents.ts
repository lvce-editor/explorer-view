import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as Assert from '../Assert/Assert.ts'
import { getChildDirentsRaw } from '../GetChildDirentsRaw/GetChildDirentsRaw.ts'
import * as ToDisplayDirents from '../ToDisplayDirents/ToDisplayDirents.ts'

export const getChildDirents = async (
  pathSeparator: string,
  parentDirent: any,
  excluded: readonly string[] = [],
): Promise<readonly ExplorerItem[]> => {
  Assert.string(pathSeparator)
  Assert.object(parentDirent)
  // TODO use event/actor based code instead, this is impossible to cancel right now
  // also cancel updating when opening new folder
  // const dispose = state => state.pendingRequests.forEach(cancelRequest)
  // TODO should use FileSystem directly in this case because it is globally available anyway
  // and more typesafe than Command.execute
  // and more performant
  const uri = parentDirent.path
  const rawDirents = await getChildDirentsRaw(uri)
  const displayDirents = ToDisplayDirents.toDisplayDirents(pathSeparator, rawDirents, parentDirent, excluded)
  return displayDirents
}
