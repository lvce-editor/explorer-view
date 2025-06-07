import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as MakeExpanded from '../MakeExpanded/MakeExpanded.ts'

// TODO this is very inefficient
export const getChildDirentsRecursively = async (dirent: ExplorerItem, pathSeparator: string): Promise<readonly ExplorerItem[]> => {
  switch (dirent.type) {
    case DirentType.File:
      return [dirent]
    case DirentType.Directory:
    case DirentType.DirectoryExpanding:
    case DirentType.DirectoryExpanded:
      const childDirents = await GetChildDirents.getChildDirents(pathSeparator, dirent.path, dirent.depth)
      const all = [MakeExpanded.makeExpanded(dirent)]
      for (const childDirent of childDirents) {
        const childAll = await getChildDirentsRecursively(childDirent, pathSeparator)
        all.push(...childAll)
      }
      return all
    default:
      return []
  }
}
