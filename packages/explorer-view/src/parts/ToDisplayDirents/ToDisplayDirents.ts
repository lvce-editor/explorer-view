import * as IconTheme from '../IconTheme/IconTheme.ts'
import * as SortExplorerItems from '../SortExplorerItems/SortExplorerItems.ts'

export const toDisplayDirents = (pathSeparator: string, rawDirents: any, parentDirent: any, excluded: any): any[] => {
  SortExplorerItems.sortExplorerItems(rawDirents)
  // TODO figure out whether this uses too much memory (name,path -> redundant, depth could be computed on demand)
  const toDisplayDirent = (rawDirent: any, index: number): any => {
    const path = [parentDirent.path, rawDirent.name].join(pathSeparator)
    return {
      name: rawDirent.name,
      posInSet: index + 1,
      setSize: rawDirents.length,
      depth: parentDirent.depth + 1,
      type: rawDirent.type,
      path, // TODO storing absolute path might be too costly, could also store relative path here
      icon: IconTheme.getIcon(rawDirent),
    }
  }
  const result = []
  let i = 0
  for (const rawDirent of rawDirents) {
    if (excluded.includes(rawDirent.name)) {
      continue
    }
    result.push(toDisplayDirent(rawDirent, i))
    i++
  }
  return result
}
