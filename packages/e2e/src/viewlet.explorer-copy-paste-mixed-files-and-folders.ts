import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-paste-mixed-files-and-folders'

export const skip = 1

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/source/folder`)
  await FileSystem.mkdir(`${tmpDir}/target`)
  await FileSystem.writeFile(`${tmpDir}/source/file.txt`, '')
  await FileSystem.writeFile(`${tmpDir}/source/folder/nested.txt`, '')
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()

  // act
  await Explorer.selectIndices([2, 3])
  await Explorer.handleCopy()
  await Explorer.focusIndex(4)
  await Explorer.handlePaste()
  await Explorer.expandRecursively()

  // assert
  const copiedFile = Locator(`.TreeItem[title="${tmpDir}/target/file.txt"]`)
  const copiedNested = Locator(`.TreeItem[title="${tmpDir}/target/folder/nested.txt"]`)
  await expect(copiedFile).toBeVisible()
  await expect(copiedNested).toBeVisible()
}
