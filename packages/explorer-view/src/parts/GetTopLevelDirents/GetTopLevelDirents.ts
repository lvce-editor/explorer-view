import * as DirentType from '../DirentType/DirentType.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'

export const getTopLevelDirents = (root: string, pathSeparator: string, excluded: any[]): any => {
  if (!root) {
    return []
  }
  return getChildDirents(
    pathSeparator,
    {
      depth: 0,
      path: root,
      type: DirentType.Directory,
    },
    excluded,
  )
}
