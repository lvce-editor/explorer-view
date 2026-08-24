import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-delete-file-refresh'

export const skip = 1

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

  // act: removeDirent deletes file1, refresh rebuilds tree — both fire concurrently
  await Promise.all([Explorer.removeDirent(), Explorer.refresh()])

  // assert: explorer should be stable — no crash, no stale references
  // file2.txt and file3.txt should always be visible
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  // At most 2 items (file2.txt + file3.txt) — file1 should be gone
  const treeItems = Locator('.TreeItem')
  const thirdItem = treeItems.nth(2)
  await expect(thirdItem).toBeHidden()
}
