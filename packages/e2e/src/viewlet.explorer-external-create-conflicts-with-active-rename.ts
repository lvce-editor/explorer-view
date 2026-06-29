import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-external-create-conflicts-with-active-rename'
export const skip = 1

export const test: Test = async () => {
  // TODO arrange: start renaming a file to a target name that does not yet exist.
  // TODO act: externally create the target name, then accept the rename.
  // TODO assert: Explorer reports the conflict and keeps state consistent.
}
