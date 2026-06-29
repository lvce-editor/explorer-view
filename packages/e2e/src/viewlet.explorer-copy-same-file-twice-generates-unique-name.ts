import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-same-file-twice-generates-unique-name'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create a file and copy it through Explorer.
  // TODO act: paste the same copied file twice into the same folder.
  // TODO assert: Explorer creates deterministic unique names and keeps them sorted.
}
