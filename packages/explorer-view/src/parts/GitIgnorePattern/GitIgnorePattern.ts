export interface GitIgnorePattern {
  readonly anchored: boolean
  readonly basePath: string
  readonly directoryOnly: boolean
  readonly hasSlash: boolean
  readonly negative: boolean
  readonly pattern: string
}
