import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-open-file-keeps-editor-stable'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create a file, open it from Explorer, and focus the Explorer row.
  // TODO act: delete the open file from Explorer.
  // TODO assert: the Explorer row is removed and the editor remains in a stable missing-file state.
}
