export interface ExplorerItem {
  readonly depth: number
  readonly name: string
  readonly path: string
  readonly posInSet?: number
  readonly selected: boolean
  readonly setSize?: number
  readonly type: number
}
