import type { Copy, CreateFile, CreateFolder, Remove, Rename } from '../FileOperationType/FileOperationType.ts'

export interface FileOperationBase {
  readonly type: number
}

export interface FileOperationCreateFile extends FileOperationBase {
  readonly type: typeof CreateFile
  readonly path: string
  readonly text: string
}

export interface FileOperationCreateFolder extends FileOperationBase {
  readonly type: typeof CreateFolder
  readonly path: string
}

export interface FileOperationCopy extends FileOperationBase {
  readonly type: typeof Copy
  readonly path: string
  readonly from: string
}

export interface FileOperationRename extends FileOperationBase {
  readonly type: typeof Rename
  readonly path: string
  readonly from: string
}

export interface FileOperationRemove extends FileOperationBase {
  readonly type: typeof Remove
  readonly path: string
}

export type FileOperation = FileOperationCopy | FileOperationCreateFile | FileOperationCreateFolder | FileOperationRename | FileOperationRemove
