import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-delete-collapsed-folder-with-selected-hidden-child'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: select a child file, collapse its parent folder, and focus the parent.
  // TODO act: delete the collapsed parent folder.
  // TODO assert: Explorer deletes the intended parent and does not use stale hidden-child selection.
}
