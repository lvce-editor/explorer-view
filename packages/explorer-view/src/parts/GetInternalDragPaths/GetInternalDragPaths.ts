import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import { ensureUri } from '../EnsureUris/EnsureUris.ts'

export const getInternalDragPaths = (items: readonly ExplorerItem[], uris: readonly string[]): readonly string[] => {
  if (uris.length === 0) {
    return []
  }
  const pathByUri = new Map(items.map((item) => [ensureUri(item.path), item.path]))
  const paths: string[] = []
  for (const uri of uris) {
    const path = pathByUri.get(uri)
    if (path === undefined) {
      return []
    }
    paths.push(path)
  }
  return paths
}
