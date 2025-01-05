export interface List<T> {
  readonly items: readonly T[]
  readonly focusedIndex: number
  readonly minLineY: number
  readonly maxLineY: number
  readonly itemHeight: number
  readonly headerHeight: number
  readonly height: number
}
