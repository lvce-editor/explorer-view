export interface FileOperation {
  readonly type: 'createFile' | 'createFolder' | 'copy'
  readonly text: string
  readonly path: string
  readonly from?: string
}

export interface FileOperationCreateFile {
  readonly type: 'createFile'
  readonly path: string
  readonly text: string
}

export interface FileOperationCreateFolder {
  readonly type: 'createFolder'
  readonly path: string
}

export interface FileOperationCopy {
  readonly type: 'copy'
  readonly path: string
  readonly from: string
}
