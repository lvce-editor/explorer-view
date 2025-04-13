export interface VisibleExplorerItem {
  readonly isEditing: boolean
  readonly hasEditingError: boolean
  readonly icon: string
  readonly depth: number
  readonly name: string
  readonly path: string
  readonly posInSet: number
  readonly setSize: number
  readonly indent: string // TODO maybe use a classname for indent instead of inline styles
  readonly chevron: number
  readonly id: string | undefined // TODO make it always string
  readonly className: string
  readonly ariaExpanded: string | undefined // TODO make it always string
}
