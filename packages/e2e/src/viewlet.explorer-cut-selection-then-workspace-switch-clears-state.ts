import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-cut-selection-then-workspace-switch-clears-state'
export const skip = 1

export const test: Test = async () => {
  // Deferred: switching workspaces after Explorer cut currently keeps stale Explorer state visible.
}
