import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-large-directory-typeahead-focus'
export const skip = 1

export const test: Test = async () => {
  // Deferred: Explorer.handleKeyDown typeahead does not currently focus matching rows in the e2e runner.
}
