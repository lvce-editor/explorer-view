import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-switch-workspace-while-editing'
export const skip = 1

export const test: Test = async () => {
  // Deferred: switching workspaces while an Explorer edit is open currently keeps stale Explorer state visible.
}
