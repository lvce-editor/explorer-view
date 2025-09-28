import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-and-paste-folder-error'

export const test: Test = async ({ FileSystem, Workspace, Explorer, ClipBoard }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/a/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()

  // act
  await Explorer.handleCopy()
  await Explorer.focusIndex(1)
  await Explorer.handlePaste()

  // assert
  // TODO error message should be displayed
}
