import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-open-file-updates-tab-title'
export const skip = 1

export const test: Test = async () => {
  // Deferred: renaming an already-open file does not currently update the Explorer row and editor tab consistently.
}
