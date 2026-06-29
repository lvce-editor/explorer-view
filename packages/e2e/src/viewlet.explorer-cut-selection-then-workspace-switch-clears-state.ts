import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-cut-selection-then-workspace-switch-clears-state'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: cut one or more selected items in the current workspace.
  // TODO act: switch to a different workspace path.
  // TODO assert: cut styling and paste state from the previous workspace are cleared.
}
