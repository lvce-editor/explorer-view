import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-focus-index-delete'

export const test: Test = async ({ Dialog, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await Dialog.mockConfirm(() => true)
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: focusIndex changes focus to index 1, removeDirent deletes currently focused item (0) — both fire concurrently
  await Promise.all([Explorer.focusIndex(1), Explorer.removeDirent()])

  // assert: explorer should be stable — no crash, no stale focus
  // file3.txt should always be visible; either file1.txt or file2.txt may be deleted
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file3).toBeVisible()

  // Exactly two rows remain, with one valid active row
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
  const activeTreeItem = Locator('.TreeItem#TreeItemActive')
  await expect(activeTreeItem).toHaveCount(1)
}
