import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-and-paste-folder'

export const test: Test = async ({ ClipBoard, Explorer, FileSystem, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir({ scheme: 'file' })
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()

  // act
  await Explorer.handleCopy()
  await Explorer.focusIndex(2)
  await Explorer.handlePaste()
  await Explorer.expandAll()

  // assert
  await FileSystem.shouldHaveFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.shouldHaveFile(`${tmpDir}/b/a/file.txt`, 'content')
}
