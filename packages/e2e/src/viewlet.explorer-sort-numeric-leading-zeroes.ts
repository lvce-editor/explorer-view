import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-sort-numeric-leading-zeroes'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create file1.txt, file01.txt, file001.txt, and file10.txt.
  // TODO act: open the workspace in Explorer.
  // TODO assert: numeric names with leading zeroes sort deterministically.
}
