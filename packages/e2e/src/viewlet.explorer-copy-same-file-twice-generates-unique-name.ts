import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-same-file-twice-generates-unique-name'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await Explorer.focusFirst()
  await Explorer.handleCopy()

  // act
  await Explorer.focusIndex(-1)
  await Explorer.handlePaste()
  await Explorer.focusIndex(-1)
  await Explorer.handlePaste()

  // assert
  const firstCopy = Locator('.TreeItem[aria-label="file copy.txt"]')
  const secondCopy = Locator('.TreeItem[aria-label="file copy 1.txt"]')
  await expect(firstCopy).toBeVisible()
  await expect(secondCopy).toBeVisible()
  await FileSystem.shouldHaveFile(`${tmpDir}/file copy.txt`, 'content')
  await FileSystem.shouldHaveFile(`${tmpDir}/file copy 1.txt`, 'content')
}
