export interface DomEventListener {
  readonly name: string | number
  readonly params: readonly string[]
  readonly preventDefault?: boolean
  readonly passive?: boolean
  readonly stopPropagation?: boolean
}
