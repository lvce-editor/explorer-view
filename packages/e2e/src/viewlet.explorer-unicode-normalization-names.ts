import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-unicode-normalization-names'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create visually similar NFC and NFD file names.
  // TODO act: open, select, and rename each file through Explorer.
  // TODO assert: both entries remain distinct and operations target the intended file.
}
