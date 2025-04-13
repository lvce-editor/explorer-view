import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'

export const sortExplorerItems = (rawDirents: readonly ExplorerItem[]): readonly ExplorerItem[] => {
  return rawDirents.toSorted(CompareDirent.compareDirent)
}
