export interface Settings {
  readonly confirmDelete: boolean
  readonly confirmPaste: boolean
  readonly excluded: readonly string[]
  readonly gitIgnoreDecorations: boolean
  readonly sourceControlDecorations: boolean
  readonly useChevrons: boolean
}
