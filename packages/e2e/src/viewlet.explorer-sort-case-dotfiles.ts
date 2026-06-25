import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-case-dotfiles'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create mixed dotfiles, lowercase files, uppercase files, folders, and underscore names.
  // TODO act: open the workspace in Explorer.
  // TODO assert: rows appear in the expected stable sort order.
}
