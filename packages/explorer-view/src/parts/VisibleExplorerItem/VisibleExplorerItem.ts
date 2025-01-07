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
  readonly useChevrons: boolean
  readonly indent: string // TODO maybe use a classname for indent instead of inline styles
}
