import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-case-only-rename'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create file.txt and focus it in Explorer.
  // TODO act: rename file.txt to File.txt.
  // TODO assert: only one row exists, focus is preserved, and the file exists under the new casing.
}
