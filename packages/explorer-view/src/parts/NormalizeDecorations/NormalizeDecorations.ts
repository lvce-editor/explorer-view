import type { FileDecoration } from '../FileDecoration/FileDecoration.ts'

const isValid = (decoration: FileDecoration): boolean => {
  return decoration && typeof decoration.type === 'string' && typeof decoration.uri === 'string'
}

export const normalizeDecorations = (decorations: readonly FileDecoration[]): readonly FileDecoration[] => {
  if (!decorations) {
    return []
  }
  return decorations.filter(isValid)
}
