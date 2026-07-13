import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { PathPart } from '../PathPart/PathPart.ts'
import { getChildDirents } from '../GetChildDirents/GetChildDirents.ts'
import { orderDirents } from '../OrderDirents/OrderDirents.ts'

const getPathPartChildren = async (pathPart: PathPart, excluded: readonly string[], root: string): Promise<readonly ExplorerItem[]> => {
  const children = await getChildDirents(pathPart.pathSeparator, pathPart.path, pathPart.depth, excluded, root)
  return children
}

export const getPathPartsChildren = async (
  pathparts: readonly PathPart[],
  excluded: readonly string[] = [],
  root: string = pathparts[0]?.path || '',
): Promise<readonly ExplorerItem[]> => {
  const pathPartsChildren = await Promise.all(pathparts.map((pathPart) => getPathPartChildren(pathPart, excluded, root)))
  const pathPartsChildrenFlat = pathPartsChildren.flat()
  const orderedPathParts = orderDirents(pathPartsChildrenFlat)
  return orderedPathParts
}
