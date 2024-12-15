import * as IconTheme from '../IconTheme/IconTheme.ts'

export const updateIcon = (dirent: any): any => {
  return { ...dirent, icon: IconTheme.getIcon(dirent) }
}
