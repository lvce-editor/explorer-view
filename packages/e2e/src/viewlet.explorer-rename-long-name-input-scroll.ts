import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-rename-long-name-input-scroll'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create a file with a very long name and focus it.
  // TODO act: rename it using another very long name.
  // TODO assert: the edit input remains usable and the final row renders without layout breakage.
}
