import * as Assert from '../Assert/Assert.ts'
import * as DirentType from '../DirentType/DirentType.ts'
import * as ErrorCodes from '../ErrorCodes/ErrorCodes.ts'
import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as ToDisplayDirents from '../ToDisplayDirents/ToDisplayDirents.ts'

export const getIndexFromPosition = (state: any, eventX: number, eventY: number): any => {
  const { y, itemHeight, items } = state
  const index = Math.floor((eventY - y) / itemHeight)
  if (index < 0) {
    return 0
  }
  if (index >= items.length) {
    return -1
  }
  return index
}

export const getParentStartIndex = (dirents: any, index: any): any => {
  const dirent = dirents[index]
  let startIndex = index - 1
  while (startIndex >= 0 && dirents[startIndex].depth >= dirent.depth) {
    startIndex--
  }
  return startIndex
}

export const getParentEndIndex = (dirents: any, index: any): any => {
  const dirent = dirents[index]
  let endIndex = index + 1
  while (endIndex < dirents.length && dirents[endIndex].depth > dirent.depth) {
    endIndex++
  }
  return endIndex
}

const isSymbolicLink = (dirent: any): any => {
  return dirent.type === DirentType.Symlink
}

const hasSymbolicLinks = (rawDirents: any): any => {
  return rawDirents.some(isSymbolicLink)
}

const getSymlinkType = (type: any): any => {
  switch (type) {
    case DirentType.File:
      return DirentType.SymLinkFile
    case DirentType.Directory:
      return DirentType.SymLinkFolder
    default:
      return DirentType.Symlink
  }
}
// TODO maybe resolving of symbolic links should happen in shared process?
// so that there is less code and less work in the frontend
const resolveSymbolicLink = async (uri: string, rawDirent: any): any => {
  try {
    // TODO support windows paths
    const absolutePath = uri + '/' + rawDirent.name
    const type = await FileSystem.stat(absolutePath)
    const symLinkType = getSymlinkType(type)
    return {
      name: rawDirent.name,
      type: symLinkType,
    }
  } catch (error) {
    // @ts-ignore
    if (error && error.code === ErrorCodes.ENOENT) {
      return {
        name: rawDirent.name,
        type: DirentType.SymLinkFile,
      }
    }
    console.error(`Failed to resolve symbolic link for ${rawDirent.name}: ${error}`)
    return rawDirent
  }
}

const resolveSymbolicLinks = async (uri: string, rawDirents: any): any => {
  const promises = []
  for (const rawDirent of rawDirents) {
    if (isSymbolicLink(rawDirent)) {
      const resolvedDirent = resolveSymbolicLink(uri, rawDirent)
      promises.push(resolvedDirent)
    } else {
      promises.push(rawDirent)
    }
  }
  const resolvedDirents = await Promise.all(promises)
  return resolvedDirents
}

export const getChildDirentsRaw = async (uri: string): Promise<any> => {
  const rawDirents = await FileSystem.readDirWithFileTypes(uri)
  Assert.array(rawDirents)
  if (hasSymbolicLinks(rawDirents)) {
    return resolveSymbolicLinks(uri, rawDirents)
  }
  return rawDirents
}

export const getChildDirents = async (pathSeparator: string, parentDirent: any, excluded = []): any => {
  Assert.string(pathSeparator)
  Assert.object(parentDirent)
  // TODO use event/actor based code instead, this is impossible to cancel right now
  // also cancel updating when opening new folder
  // const dispose = state => state.pendingRequests.forEach(cancelRequest)
  // TODO should use FileSystem directly in this case because it is globally available anyway
  // and more typesafe than Command.execute
  // and more performant
  const uri = parentDirent.path
  const rawDirents = await getChildDirentsRaw(uri)
  const displayDirents = ToDisplayDirents.toDisplayDirents(pathSeparator, rawDirents, parentDirent, excluded)
  return displayDirents
}

export const mergeDirents = (oldDirents: any, newDirents: any): any => {
  const merged = []
  let oldIndex = 0
  for (const newDirent of newDirents) {
    merged.push(newDirent)
    for (let i = oldIndex; i < oldDirents.length; i++) {
      if (oldDirents[i].path === newDirent.path) {
        // TOOD copy children of old dirent
        oldIndex = i
        break
      }
    }
  }
  return merged
}

export const getTopLevelDirents = (root: string, pathSeparator: string, excluded: any): any => {
  if (!root) {
    return []
  }
  return getChildDirents(
    pathSeparator,
    {
      depth: 0,
      path: root,
      type: DirentType.Directory,
    },
    excluded,
  )
}
