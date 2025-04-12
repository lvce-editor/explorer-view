export interface FileOperation {
  readonly type: 'createFile' | 'createFolder' | 'copy'
  readonly text: string
  readonly path: string
  readonly from?: string
}
