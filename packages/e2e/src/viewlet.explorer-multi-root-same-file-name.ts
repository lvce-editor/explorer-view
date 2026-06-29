import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-multi-root-same-file-name'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: open two workspace roots that both contain README.md.
  // TODO act: rename or delete README.md in one root.
  // TODO assert: the operation affects only the targeted root and leaves the other README.md unchanged.
}
