import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import { join2 } from '../Path/Path.ts'

// TODO figure out whether this uses too much memory (name,path -> redundant, depth could be computed on demand)
export const toDisplayDirent = (parentDirent: ExplorerItem, rawDirent: RawDirent, index: number, length: number): ExplorerItem => {
  const path = join2(parentDirent.path, rawDirent.name)
  return {
    name: rawDirent.name,
    posInSet: index + 1,
    setSize: length,
    depth: parentDirent.depth + 1,
    type: rawDirent.type,
    path, // TODO storing absolute path might be too costly, could also store relative path here
    icon: '',
    selected: false,
  }
}
