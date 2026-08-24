import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-focus-next-refresh'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: focusNext moves focus to next item, refresh rebuilds tree — both fire concurrently
  await Promise.all([Explorer.focusNext(), Explorer.refresh()])

  // assert: explorer should be stable — no crash, no stale focus
  // All files should be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  // Exactly 3 tree items
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(3)
}
