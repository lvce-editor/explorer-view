import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-multi-root-copy-relative-path'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: open two workspace roots with nested files.
  // TODO act: copy relative path from a nested file in the second root.
  // TODO assert: clipboard contains the path relative to the second root, not the first root.
}
