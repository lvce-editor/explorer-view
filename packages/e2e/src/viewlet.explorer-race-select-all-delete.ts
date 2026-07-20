import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-select-all-delete'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: selectAll selects all items, removeDirent deletes the focused item — both fire concurrently
  await Promise.all([Explorer.selectAll(), Explorer.removeDirent()])

  // assert: explorer should be stable — no crash, no stale selection references
  // file2.txt and file3.txt should always be visible
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  // At most 3 tree items (file2.txt + file3.txt)
  const treeItems = Locator('.TreeItem')
  const row2 = treeItems.nth(2)
  await expect(row2).toBeHidden()
}
