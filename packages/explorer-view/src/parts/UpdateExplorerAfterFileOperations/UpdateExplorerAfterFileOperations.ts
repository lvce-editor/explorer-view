import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import type { FileIconCache } from '../FileIconCache/FileIconCache.ts'
import type { FileOperation } from '../FileOperation/FileOperation.ts'
import type { RawDirent } from '../RawDirent/RawDirent.ts'
import type { Tree } from '../Tree/Tree.ts'
import type { TreeItem } from '../TreeItem/TreeItem.ts'
import { createTree } from '../CreateTree/CreateTree.ts'
import { getChildDirentsRaw } from '../GetChildDirentsRaw/GetChildDirentsRaw.ts'
import * as GetExplorerMaxLineY from '../GetExplorerMaxLineY/GetExplorerMaxLineY.ts'
import * as GetFileIcons from '../GetFileIcons/GetFileIcons.ts'
import * as GetIndex from '../GetIndex/GetIndex.ts'
import { getPathPartsFromFileOperations } from '../GetPathPartsFromFileOperations/GetPathPartsFromFileOperations.ts'
import { mergeTrees } from '../MergeTrees/MergeTrees.ts'
import { treeToArray } from '../TreeToArray/TreeToArray.ts'

export interface ExplorerUpdateResult {
  readonly newItems: readonly ExplorerItem[]
  readonly newFileIconCache: FileIconCache
  readonly newIcons: readonly string[]
  readonly newMinLineY: number
  readonly newMaxLineY: number
  readonly newFocusedIndex: number
}

const toTreeItem = (rawDirent: RawDirent): TreeItem => {
  return {
    type: rawDirent.type,
    name: rawDirent.name,
  }
}

const createChildTree = async (uris: readonly string[], root: string): Promise<Tree> => {
  const tree = Object.create(null)
  for (const uri of uris) {
    const rawDirents = await getChildDirentsRaw(uri)
    const treeItems: readonly TreeItem[] = rawDirents.map(toTreeItem)
    const relativeUri = uri.slice(root.length)
    tree[relativeUri] = treeItems
  }
  return tree
}

export const updateExplorerAfterFileOperations = async (
  state: ExplorerState,
  operations: readonly FileOperation[],
  absolutePath: string,
): Promise<ExplorerUpdateResult> => {
  const { minLineY, height, itemHeight, fileIconCache, root, items } = state
  const paths = getPathPartsFromFileOperations(operations)
  const childTree = await createChildTree(paths, root)
  // TODO based on operations, find out which paths need to be updated
  // then read the direcories that need to be updated
  // and update the explorer
  const tree = createTree(items, root)
  const merged = mergeTrees(tree, childTree)
  const newItems = treeToArray(merged, root)
  const dirents = newItems
  const newFocusedIndex = GetIndex.getIndex(newItems, absolutePath)
  const maxLineY = GetExplorerMaxLineY.getExplorerMaxLineY(minLineY, height, itemHeight, dirents.length)
  const visible = dirents.slice(minLineY, maxLineY)
  const { icons, newFileIconCache } = await GetFileIcons.getFileIcons(visible, fileIconCache)
  return {
    newItems: dirents,
    newFocusedIndex,
    newFileIconCache,
    newIcons: icons,
    newMinLineY: minLineY,
    newMaxLineY: maxLineY,
  }
}
