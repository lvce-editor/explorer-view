export interface UploadTree {
  [name: string]: UploadTree | UploadTreeFile
}

export interface UploadTreeFile {
  readonly blob: Blob
}
