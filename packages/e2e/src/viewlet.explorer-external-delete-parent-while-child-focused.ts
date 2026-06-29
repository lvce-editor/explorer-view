import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-external-delete-parent-while-child-focused'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: expand a folder and focus one of its child files.
  // TODO act: delete the parent folder externally and refresh Explorer.
  // TODO assert: hidden child state is removed and focus falls back to a visible item.
}
