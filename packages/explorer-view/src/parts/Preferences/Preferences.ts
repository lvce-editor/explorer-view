export interface Prefrences {
  readonly sourceControlDecorations: boolean
}

export const getPreferences = (): Prefrences => {
  return {
    sourceControlDecorations: false,
  }
}
