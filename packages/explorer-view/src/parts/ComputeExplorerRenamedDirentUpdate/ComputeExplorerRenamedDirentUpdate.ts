import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import type { TreeUpdate } from '../TreeUpdate/TreeUpdate.ts'
import * as DirentType from '../DirentType/DirentType.ts'

export const computeExplorerRenamedDirentUpdate = (
  root: string,
  parentPath: string,
  oldUri: string,
  children: readonly ExplorerItem[],
  tree: Tree,
  newUri: string,
): TreeUpdate => {
  const rootLength = root.length
  const relativeDirname = parentPath.slice(rootLength)
  const relativeOldPath = oldUri.slice(rootLength)
  const relativeNewUri = newUri.slice(rootLength)
  const update: TreeUpdate = Object.create(null)
  const oldItems = tree[relativeOldPath] || []
  update[relativeDirname] = children.map((child) => {
    if (oldItems.length > 0 && child.path === newUri && child.type === DirentType.Directory) {
      return {
        ...child,
        type: DirentType.DirectoryExpanded,
      }
    }
    return child
  })
  update[relativeNewUri] = oldItems
  for (const [key, value] of Object.entries(tree)) {
    if (!key.startsWith(`${relativeOldPath}/`)) {
      continue
    }
    const newKey = relativeNewUri + key.slice(relativeOldPath.length)
    update[newKey] = value
  }
  return update
}
