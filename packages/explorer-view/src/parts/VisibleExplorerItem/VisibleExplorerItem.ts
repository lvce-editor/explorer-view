export interface VisibleExplorerItem {
  readonly isFocused: boolean
  readonly isEditing: boolean
  readonly icon: string
  readonly depth: number
  readonly name: string
  readonly path: string
  readonly posInSet: number
  readonly setSize: number
  readonly type: number
}
