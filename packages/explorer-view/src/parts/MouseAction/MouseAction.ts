export interface MouseAction {
  readonly description: string
  readonly button: number
  readonly modifiers: {
    readonly ctrl?: boolean
    readonly shift?: boolean
    readonly alt?: boolean
    readonly meta?: boolean
  }
  readonly command: string
  readonly when?: number
}
