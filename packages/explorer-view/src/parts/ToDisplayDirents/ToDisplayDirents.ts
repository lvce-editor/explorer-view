import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'
import { toDisplayDirent } from '../ToDisplayDirent/ToDisplayDirent.ts'

export const toDisplayDirents = (
  pathSeparator: string,
  rawDirents: readonly RawDirent[],
  parentDirent: any,
  excluded: readonly string[],
): readonly ExplorerItem[] => {
  rawDirents = SortExplorerItems.sortExplorerItems(rawDirents)
  const result: ExplorerItem[] = []
  const visibleItems = rawDirents.filter((item) => {
    if (excluded.includes(item.name)) {
      return false
    }
    return true
  })
  const count = visibleItems.length
  for (let i = 0; i < visibleItems.length; i++) {
    const rawDirent = visibleItems[i]
    result.push(toDisplayDirent(parentDirent, rawDirent, i, count))
  }
  return result
}
