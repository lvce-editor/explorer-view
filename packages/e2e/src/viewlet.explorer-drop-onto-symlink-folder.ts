import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-onto-symlink-folder'
export const skip = 1

export const test: Test = async () => {
  // Deferred: this e2e environment does not expose FileSystem.symlink, and Explorer drop handling does not resolve symlink targets yet.
}
