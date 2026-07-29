import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-double-click-delete'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: handleDoubleClick on empty space creates editing row, removeDirent deletes file1.txt — both fire concurrently
  await Promise.all([Explorer.handleDoubleClick(20, 100), Explorer.removeDirent()])

  // assert: explorer should be stable — no crash, no stale references
  // At most 1 tree item (possibly editing row)
  const treeItems = Locator('.TreeItem')
  const row1 = treeItems.nth(1)
  await expect(row1).toBeHidden()
}
