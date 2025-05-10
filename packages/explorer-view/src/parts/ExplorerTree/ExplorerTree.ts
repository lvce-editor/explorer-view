export interface ExplorerTreeItem {
  readonly name: string
  readonly type: number
  readonly children: readonly ExplorerTreeItem[]
}

export interface ExplorerTree {}
