import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-path-empty'

export const test: Test = async ({ ClipBoard, Command, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Command.execute('Explorer.copyPath')

  // assert
  await ClipBoard.shouldHaveText('')
}
