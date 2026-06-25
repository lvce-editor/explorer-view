import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-folder-name-collision-generates-unique-name'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: create a folder with child files and copy it through Explorer.
  // TODO act: paste the folder into a location where its name already exists.
  // TODO assert: Explorer creates a uniquely named folder and preserves the copied children.
}
