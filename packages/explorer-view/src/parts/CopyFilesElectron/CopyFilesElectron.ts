import { getFilePaths } from '../GetFilePaths/GetFilePaths.ts'

// TODO copy files in parallel
export const copyFilesElectron = async (root: string, pathSeparator: string, files: readonly FileSystemHandle[]): Promise<void> => {
  const paths = await getFilePaths(files)
  console.log({ paths })
  // for (const path of paths) {
  // const to = Path.join(pathSeparator, root, file.name)
  // await FileSystem.copy(from, to)
  // }
}
