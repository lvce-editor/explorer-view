import { VError } from '@lvce-editor/verror'
import * as CreateNestedPath from '../CreateNestedPath/CreateNestedPath.ts'
import * as Path from '../Path/Path.ts'

export interface Create {
  (path: string): Promise<void>
}

export const createNewDirentsAccept = async (
  newFileName: string,
  pathSeparator: string,
  absolutePath: string,
  root: string,
  createFn: Create,
): Promise<string> => {
  try {
    // Create parent directories if they don't exist
    if (newFileName.includes(pathSeparator)) {
      const parentPath = Path.dirname(pathSeparator, absolutePath)
      await CreateNestedPath.createNestedPath(root, parentPath, pathSeparator)
    }
    await createFn(absolutePath)
    return ''
  } catch (error) {
    console.error(new VError(error, `Failed to create file`))
    return `${error}`
  }
}
