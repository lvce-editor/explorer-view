import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { Tree } from '../Tree/Tree.ts'
import type { TreeItem } from '../TreeItem/TreeItem.ts'
import type { TreeUpdate } from '../TreeUpdate/TreeUpdate.ts'
import * as CompareDirent from '../CompareDirent/CompareDirent.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import { normalizeDirentType } from '../NormalizeDirentType/NormalizeDirentType.ts'
import { getBaseName } from '../Path/Path.ts'

const getUpdatedChildren = (
  children: readonly ExplorerItem[],
  previousChildren: readonly TreeItem[],
  oldUri: string,
  newUri: string,
  renamedChildren: readonly TreeItem[],
): readonly ExplorerItem[] => {
  const setSize = children.length
  const previousTypes = new Map(previousChildren.map((child) => [child.name, normalizeDirentType(child.type)]))
  const oldName = getBaseName('/', oldUri)
  return children.toSorted(CompareDirent.compareDirent).map((child, index) => {
    const previousName = child.path === newUri ? oldName : child.name
    const previousType = previousTypes.get(previousName)
    const wasExpanded = previousType === DirentType.DirectoryExpanded || (child.path === newUri && renamedChildren.length > 0)
    if (wasExpanded && child.type === DirentType.Directory) {
      return {
        ...child,
        posInSet: index + 1,
        setSize,
        type: DirentType.DirectoryExpanded,
      }
    }
    return {
      ...child,
      posInSet: index + 1,
      setSize,
    }
  })
}

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
  const previousChildren = tree[relativeDirname] || []
  update[relativeDirname] = getUpdatedChildren(children, previousChildren, oldUri, newUri, oldItems)
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
