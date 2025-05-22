import type { Selection } from '../Selection/Selection.ts'

export const getRenameSelectionRange = (name: string): Selection => {
  const dotIndex = name.lastIndexOf('.')
  if (dotIndex === -1) {
    return {
      start: 0,
      end: name.length,
    }
  }
  return {
    start: 0,
    end: dotIndex,
  }
}
