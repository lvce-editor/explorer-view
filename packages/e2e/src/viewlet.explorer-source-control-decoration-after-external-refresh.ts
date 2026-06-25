import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-source-control-decoration-after-external-refresh'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: load source-control decorations for files in Explorer.
  // TODO act: externally rename, delete, and recreate decorated files, then refresh.
  // TODO assert: decorations update for current files and stale decorations disappear.
}
