import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-switch-workspace-while-editing'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: start creating or renaming a file in the current workspace.
  // TODO act: switch the workspace path while the edit input is open.
  // TODO assert: the stale edit input disappears and Explorer shows only the new workspace contents.
}
