import type { FileDecoration } from '../FileDecoration/FileDecoration.ts'
import { ensureUri } from '../EnsureUris/EnsureUris.ts'

const isValid = (decoration: FileDecoration): boolean => {
  return decoration && typeof decoration.decoration === 'string' && typeof decoration.uri === 'string'
}

const normalizeDecoration = (decoration: FileDecoration): FileDecoration => {
  return {
    ...decoration,
    uri: ensureUri(decoration.uri),
  }
}

export const normalizeDecorations = (decorations: readonly FileDecoration[]): readonly FileDecoration[] => {
  if (!decorations || !Array.isArray(decorations)) {
    return []
  }
  return decorations.filter(isValid).map(normalizeDecoration)
}
