export interface ExplorerState {
  readonly uid: number
  readonly parentUid: number
  readonly root: string
  readonly items: readonly any[]
  readonly focusedIndex: -1
  readonly focused: boolean
  readonly hoverIndex: -1
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly deltaY: number
  readonly minLineY: number
  readonly maxLineY: number
  readonly pathSeparator: string
  readonly version: number
  readonly editingIndex: number
  readonly itemHeight: number
  readonly dropTargets: readonly any[]
  readonly excluded: readonly any[]
  readonly editingValue: string
  readonly editingType: number
  readonly editingIcon: string
}
