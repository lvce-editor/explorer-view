import * as FileSystem from '../FileSystem/FileSystem.ts'
import * as GetFilePathElectron from '../GetFilePathElectron/GetFilePathElectron.ts'
import * as Path from '../Path/Path.ts'

// TODO copy files in parallel
export const copyFilesElectron = async (root: string, pathSeparator: string, files: readonly FileSystemHandle[]): Promise<void> => {
  for (const file of files) {
    // @ts-ignore
    const from = await GetFilePathElectron.getFilePathElectron(file)
    // const from = file.path
    const to = Path.join(pathSeparator, root, file.name)
    await FileSystem.copy(from, to)
  }
}
