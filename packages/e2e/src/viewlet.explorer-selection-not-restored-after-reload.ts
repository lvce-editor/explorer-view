import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-selection-not-restored-after-reload'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: select multiple Explorer items and save or reload the workbench.
  // TODO act: restore the workspace session.
  // TODO assert: transient selection is not restored while persistent focus and expansion state follow product behavior.
}
