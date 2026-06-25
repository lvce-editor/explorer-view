import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drag-autoscroll-long-list'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create a long Explorer list with source and target items far apart.
  // TODO act: drag near the top or bottom edge until Explorer autoscrolls.
  // TODO assert: the list scrolls, the drop target updates, and the drop completes correctly.
}
