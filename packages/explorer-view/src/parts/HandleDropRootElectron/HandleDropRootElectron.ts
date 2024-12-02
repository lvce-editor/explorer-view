import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetChildDirents from '../GetChildDirents/GetChildDirents.ts'
import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'
import * as Path from '../Path/Path.ts'

const mergeDirents = (oldDirents: any, newDirents: any): any => {
  return newDirents
}

// TODO copy files in parallel
const copyFilesElectron = async (root: any, pathSeparator: any, files: any): Promise<any> => {
  for (const file of files) {
    const from = await GetFilePathElectron.getFilePathElectron(file)
    // const from = file.path
    const to = Path.join(pathSeparator, root, file.name)
    await FileSystem.copy(from, to)
  }
}

const getMergedDirents = async (root: any, pathSeparator: any, dirents: any): Promise<any> => {
  const childDirents = await GetChildDirents.getChildDirents(pathSeparator, {
    path: root,
    depth: 0,
  })
  const mergedDirents = mergeDirents(dirents, childDirents)
  return mergedDirents
}

export const handleDrop = async (state: any, files: any): Promise<any> => {
  const { root, pathSeparator, items } = state
  await copyFilesElectron(root, pathSeparator, files)
  const mergedDirents = await getMergedDirents(root, pathSeparator, items)
  return {
    ...state,
    items: mergedDirents,
    dropTargets: [],
  }
}
