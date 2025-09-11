import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-empty-workspace'

export const skip = 1

export const test: Test = async ({ Workspace, Explorer }) => {
  // arrange
  await Workspace.setPath('')
  await Explorer.selectIndices([0, 1])

  // act
  await Explorer.handleBlur()
}
