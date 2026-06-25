import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-zero-width-file-names'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create file names containing zero-width joiners or zero-width spaces.
  // TODO act: open the workspace and focus each affected row.
  // TODO assert: rows remain selectable and are not confused with empty-looking names.
}
