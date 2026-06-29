import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-folder-name-collision-generates-unique-name'
export const skip = 1

export const test: Test = async () => {
  // Deferred: folder copy/drop name-collision handling does not currently generate unique "copy" names.
}
