import * as DirentType from '../DirentType/DirentType.ts'

export const getIconCacheKey = (path: string, type: number): string => {
  switch (type) {
    case DirentType.DirectoryExpanded:
    case DirentType.DirectoryExpanding:
    case DirentType.EditingDirectoryExpanded:
      return `${path}#expanded`
    default:
      return path
  }
}
