import type { Copy, CreateFile, CreateFolder, Remove, Rename } from '../FileOperationType/FileOperationType.ts'

interface FileOperationBase {
  readonly type: number
}

interface FileOperationCreateFileBlob extends FileOperationBase {
  readonly blob: Blob
  readonly path: string
  readonly type: typeof CreateFile
}

interface FileOperationCreateFileText extends FileOperationBase {
  readonly path: string
  readonly text: string
  readonly type: typeof CreateFile
}

interface FileOperationCreateFolder extends FileOperationBase {
  readonly path: string
  readonly type: typeof CreateFolder
}

interface FileOperationCopy extends FileOperationBase {
  readonly from: string
  readonly path: string
  readonly type: typeof Copy
}

interface FileOperationRename extends FileOperationBase {
  readonly from: string
  readonly path: string
  readonly type: typeof Rename
}

interface FileOperationRemove extends FileOperationBase {
  readonly path: string
  readonly type: typeof Remove
}

export type FileOperation =
  | FileOperationCopy
  | FileOperationCreateFileBlob
  | FileOperationCreateFileText
  | FileOperationCreateFolder
  | FileOperationRename
  | FileOperationRemove
