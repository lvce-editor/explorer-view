import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'

export const renameDirentsPath = (items: readonly ExplorerItem[], oldAbsolutePath: string, newAbsolutePath: string): readonly ExplorerItem[] => {
  const oldPathWithSlash = `${oldAbsolutePath}/`
  const oldPathWithSlashLength = oldPathWithSlash.length
  const newPathWithSlash = `${newAbsolutePath}/`
  return items.map((item) => {
    if (item.path === oldPathWithSlash) {
      return {
        ...item,
        path: newPathWithSlash,
      }
    }
    if (item.path.startsWith(oldPathWithSlash)) {
      return {
        ...item,
        path: newPathWithSlash + item.path.slice(oldPathWithSlashLength),
      }
    }
    return item
  })
}
