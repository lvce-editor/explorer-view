import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import { isExcluded } from '../IsExcluded/IsExcluded.ts'
import { join2 } from '../Path/Path.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'
import { toDisplayDirent } from '../ToDisplayDirent/ToDisplayDirent.ts'

export const toDisplayDirents = (
  pathSeparator: string,
  rawDirents: readonly RawDirent[],
  parentDirentPath: string,
  parentDirentDepth: number,
  excluded: readonly string[],
  expanded: boolean = false,
  root: string = parentDirentPath,
): readonly ExplorerItem[] => {
  rawDirents = SortExplorerItems.sortExplorerItems(rawDirents)
  const result: ExplorerItem[] = []
  const visibleItems = rawDirents.filter((item) => !isExcluded(root, join2(parentDirentPath, item.name), excluded))
  const count = visibleItems.length
  for (let i = 0; i < visibleItems.length; i++) {
    const rawDirent = visibleItems[i]
    result.push(toDisplayDirent(parentDirentPath, parentDirentDepth, rawDirent.type, rawDirent.name, i, count))
  }
  return result
}
