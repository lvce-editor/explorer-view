import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-drop-onto-symlink-folder'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create a symbolic-link folder and a file to drag.
  // TODO act: drop the file onto the symlink folder.
  // TODO assert: Explorer either resolves the symlink target or reports a consistent error.
}
