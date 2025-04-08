import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'

export const sortExplorerItems = (rawDirents: ExplorerItem[]): readonly ExplorerItem[] => {
  return rawDirents.toSorted(CompareDirent.compareDirent)
}
