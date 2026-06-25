import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-path-special-root-path'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: open a workspace root whose path contains spaces, symbols, and non-ASCII characters.
  // TODO act: copy the full path for a nested file.
  // TODO assert: clipboard preserves the exact filesystem path.
}
