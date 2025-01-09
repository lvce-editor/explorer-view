export interface VisibleExplorerItem {
  readonly isEditing: boolean
  readonly icon: string
  readonly depth: number
  readonly name: string
  readonly path: string
  readonly posInSet: number
  readonly setSize: number
  readonly indent: string // TODO maybe use a classname for indent instead of inline styles
  readonly expanded: number
  readonly chevron: number
  readonly id: string | undefined
  readonly className: string
}
