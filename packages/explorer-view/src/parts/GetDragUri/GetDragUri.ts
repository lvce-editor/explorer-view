import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { ensureUri } from '../EnsureUris/EnsureUris.ts'

const directoryTypes = new Set([
  DirentType.Directory,
  DirentType.DirectoryExpanded,
  DirentType.DirectoryExpanding,
  DirentType.EditingDirectoryExpanded,
  DirentType.EditingFolder,
  DirentType.SymLinkFolder,
])

export const getDragUri = (item: Pick<ExplorerItem, 'path' | 'type'>): string => {
  const uri = ensureUri(item.path)
  if (directoryTypes.has(item.type) && !uri.endsWith('/')) {
    return `${uri}/`
  }
  return uri
}
