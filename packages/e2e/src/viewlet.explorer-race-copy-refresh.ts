import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-copy-refresh'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: handleCopy captures the focused item while refresh concurrently replaces that item
  await Promise.all([Explorer.handleCopy(), Explorer.refresh()])

  // assert: both files remain visible exactly once
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()

  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
}
