import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-copy-same-file-twice-generates-unique-name'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  const sourceDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${sourceDir}/file.txt`, 'content')
  await Workspace.setPath(tmpDir)
  await ClipBoard.writeNativeFiles([`${sourceDir}/file.txt`])

  // act
  await Explorer.focusIndex(-1)
  await Explorer.handlePaste()
  await Explorer.focusIndex(-1)
  await Explorer.handlePaste()

  // assert
  const original = Locator('.TreeItem[aria-label="file.txt"]')
  const firstCopy = Locator('.TreeItem[aria-label="file copy.txt"]')
  await expect(original).toBeVisible()
  await expect(firstCopy).toBeVisible()
  await expect(Locator('.TreeItem')).toHaveCount(2)
  await FileSystem.shouldHaveFile(`${tmpDir}/file.txt`, 'content')
  await FileSystem.shouldHaveFile(`${tmpDir}/file copy.txt`, 'content')
}
