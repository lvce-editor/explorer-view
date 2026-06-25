import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-icon-theme-missing-icon-fallback'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: activate an icon theme with missing file or folder icon entries.
  // TODO act: open a workspace containing affected files and folders.
  // TODO assert: Explorer renders fallback icons and rows remain visible.
}
