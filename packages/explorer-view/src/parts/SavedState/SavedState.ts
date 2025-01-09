export interface SavedState {
  readonly expandedPaths: readonly string[]
  readonly root: string
  readonly minLineY: number
  readonly maxLineY: number
  readonly deltaY: number
}
