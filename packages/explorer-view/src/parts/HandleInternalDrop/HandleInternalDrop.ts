import type { ExplorerItem } from '../ExplorerItem/ExplorerItem.ts'
import type { ExplorerState } from '../ExplorerState/ExplorerState.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ExplorerStrings from '../ExplorerStrings/ExplorerStrings.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as Path from '../Path/Path.ts'
import * as Refresh from '../Refresh/Refresh.ts'

interface MoveOperation {
  readonly from: string
  readonly path: string
}

const directoryTypes: readonly number[] = [DirentType.Directory, DirentType.DirectoryExpanded, DirentType.DirectoryExpanding]

const isDirectory = (item: ExplorerItem): boolean => {
  return directoryTypes.includes(item.type)
}

const isDescendant = (path: string, parentPath: string, pathSeparator: string): boolean => {
  const prefix = parentPath.endsWith(pathSeparator) ? parentPath : `${parentPath}${pathSeparator}`
  return path.startsWith(prefix)
}

const join = (parentPath: string, name: string, pathSeparator: string): string => {
  if (parentPath.endsWith(pathSeparator)) {
    return `${parentPath}${name}`
  }
  return `${parentPath}${pathSeparator}${name}`
}

const getTargetFolder = (state: ExplorerState, index: number): string => {
  const { items, pathSeparator, root } = state
  if (index === -1) {
    return root
  }
  const item = items[index]
  if (!item) {
    throw new Error('Drop target does not exist')
  }
  if (isDirectory(item)) {
    return item.path
  }
  if (item.type === DirentType.File) {
    return Path.dirname(pathSeparator, item.path)
  }
  throw new Error('Drop target is not a file or folder')
}

const getTopLevelSourcePaths = (sourcePaths: readonly string[], pathSeparator: string): readonly string[] => {
  const uniquePaths = [...new Set(sourcePaths)]
  return uniquePaths.filter((path) => uniquePaths.every((otherPath) => otherPath === path || !isDescendant(path, otherPath, pathSeparator)))
}

const getMoveOperations = (state: ExplorerState, sourcePaths: readonly string[], targetFolder: string): readonly MoveOperation[] => {
  const { items, pathSeparator } = state
  const itemByPath = new Map(items.map((item) => [item.path, item]))
  const existingPaths = new Set(itemByPath.keys())
  const destinationPaths = new Set<string>()
  const operations: MoveOperation[] = []
  for (const sourcePath of getTopLevelSourcePaths(sourcePaths, pathSeparator)) {
    const sourceItem = itemByPath.get(sourcePath)
    if (!sourceItem) {
      throw new Error(`Dragged item no longer exists: ${sourcePath}`)
    }
    if (sourcePath === targetFolder) {
      continue
    }
    if (isDirectory(sourceItem) && isDescendant(targetFolder, sourcePath, pathSeparator)) {
      throw new Error(ExplorerStrings.cannotMoveFolderIntoSubfolderOfItself(sourceItem.name))
    }
    const destinationPath = join(targetFolder, sourceItem.name, pathSeparator)
    if (destinationPath === sourcePath) {
      continue
    }
    if (destinationPaths.has(destinationPath) || existingPaths.has(destinationPath)) {
      throw new Error(ExplorerStrings.fileOrFolderAlreadyExists(sourceItem.name))
    }
    destinationPaths.add(destinationPath)
    operations.push({ from: sourcePath, path: destinationPath })
  }
  return operations
}

const expandTargetFolder = (items: readonly ExplorerItem[], targetFolder: string): readonly ExplorerItem[] => {
  return items.map((item) => {
    if (item.path === targetFolder && item.type === DirentType.Directory) {
      return { ...item, type: DirentType.DirectoryExpanded }
    }
    return item
  })
}

export const handleInternalDrop = async (state: ExplorerState, sourcePaths: readonly string[], index: number): Promise<ExplorerState> => {
  const { applicationId } = state
  const { expandedPaths: oldExpandedPaths, isReadonly, items, preserveExpandState } = state
  if (isReadonly) {
    return state
  }
  const targetFolder = getTargetFolder(state, index)
  const operations = getMoveOperations(state, sourcePaths, targetFolder)
  if (operations.length === 0) {
    return {
      ...state,
      dropTargets: [],
    }
  }
  for (const operation of operations) {
    await FileSystem.rename(operation.from, operation.path, applicationId)
  }
  const expandedItems = expandTargetFolder(items, targetFolder)
  const expandedPaths = preserveExpandState ? [...new Set([...oldExpandedPaths, targetFolder])] : oldExpandedPaths
  const updated = await Refresh.refresh({ ...state, expandedPaths, items: expandedItems })
  return {
    ...updated,
    dropTargets: [],
  }
}
