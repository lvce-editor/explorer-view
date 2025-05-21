import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export interface RenamedDirentResult {
  readonly newDirents: readonly ExplorerItem[]
  readonly focusedIndex: number
}
