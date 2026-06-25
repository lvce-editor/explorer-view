import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-large-directory-typeahead-focus'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create a large directory with distinct file-name prefixes.
  // TODO act: type a prefix while Explorer is focused.
  // TODO assert: focus jumps to the matching row without rendering stale virtual rows.
}
