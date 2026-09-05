import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'

export const getTopLevelDirents = (root: string, pathSeparator: string, excluded: any[], applicationId?: string): any => {
  if (!root) {
    return []
  }
  return getChildDirents(pathSeparator, root, 0, excluded, root, applicationId)
}
