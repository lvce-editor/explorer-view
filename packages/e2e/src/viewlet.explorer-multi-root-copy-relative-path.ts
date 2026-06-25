import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-multi-root-copy-relative-path'
export const skip = 1

export const test: Test = async () => {
  // Deferred: Explorer and the e2e Workspace helper currently expose a single root via Workspace.setPath(path).
  // Implement this when product and harness support opening multiple workspace roots.
}
