export interface FileOperationBase {
  readonly type: string
}

export interface FileOperationCreateFile extends FileOperationBase {
  readonly type: 'createFile'
  readonly path: string
  readonly text: string
}

export interface FileOperationCreateFolder extends FileOperationBase {
  readonly type: 'createFolder'
  readonly path: string
}

export interface FileOperationCopy extends FileOperationBase {
  readonly type: 'copy'
  readonly path: string
  readonly from: string
}

export interface FileOperationRename extends FileOperationBase {
  readonly type: 'rename'
  readonly path: string
  readonly from: string
}

export type FileOperation = FileOperationCopy | FileOperationCreateFile | FileOperationCreateFolder | FileOperationRename
