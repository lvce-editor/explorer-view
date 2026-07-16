import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-and-paste-file'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act
  await Explorer.handleCopy()
  await Explorer.focusIndex(-1)
  await Explorer.handlePaste()

  // assert
  const copiedFile = Locator(`.TreeItem[title="${tmpDir}/file.txt"]`)
  await expect(copiedFile).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.shouldHaveFile(`${tmpDir}/file.txt`, 'content')
}
