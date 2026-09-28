export interface ExplorerItem {
  readonly depth: number
  readonly name: string
  readonly posInSet?: number
  readonly selected: boolean
  readonly setSize?: number
  readonly type: number
  readonly uri: string
}
