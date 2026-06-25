import * as DirentType from '../DirentType/DirentType.ts'

export const isDirectoryType = (type: number): boolean => {
  return type === DirentType.Directory || type === DirentType.DirectoryExpanded || type === DirentType.DirectoryExpanding
}
