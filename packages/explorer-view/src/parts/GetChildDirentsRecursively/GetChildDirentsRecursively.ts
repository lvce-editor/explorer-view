import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as MakeExpanded from '../MakeExpanded/MakeExpanded.ts'

// TODO this is very inefficient
export const getChildDirentsRecursively = async (
  dirent: ExplorerItem,
  pathSeparator: string,
  excluded: readonly string[] = [],
  root: string = dirent.path,
): Promise<readonly ExplorerItem[]> => {
  switch (dirent.type) {
    case DirentType.Directory:
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
      const childDirents = await GetChildDirents.getChildDirents(pathSeparator, dirent.path, dirent.depth, excluded, root)
      const all = [MakeExpanded.makeExpanded(dirent)]
      for (const childDirent of childDirents) {
        const childAll = await getChildDirentsRecursively(childDirent, pathSeparator, excluded, root)
        all.push(...childAll)
      }
      return all
    case DirentType.File:
      return [dirent]
    default:
      return []
  }
}
