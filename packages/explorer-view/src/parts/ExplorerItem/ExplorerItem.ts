export interface ExplorerItem {
  readonly name: string
  readonly type: number
  readonly path: string
  readonly depth: number
  readonly selected: boolean
  readonly posInSet?: number
  readonly setSize?: number
  readonly icon?: string
}
