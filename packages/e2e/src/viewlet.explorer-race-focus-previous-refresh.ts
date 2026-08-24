import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-focus-previous-refresh'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  // act: focusPrevious changes the active row while refresh concurrently replaces all rows
  await Promise.all([Explorer.focusPrevious(), Explorer.refresh()])

  // assert: all files remain visible exactly once
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(3)
}
