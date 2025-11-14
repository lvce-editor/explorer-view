import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-path-folder'

export const test: Test = async ({ Command, FileSystem, Workspace, Explorer, ClipBoard }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act
  await Command.execute('Explorer.copyPath')

  // assert
  await ClipBoard.shouldHaveText('memfs:///workspace/a')
}
