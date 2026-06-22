import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-delete-file-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: removeDirent deletes file1, refresh rebuilds tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.removeDirent'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no stale references
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  // file1 should be hidden (deleted)
  await expect(file1).toBeHidden()

  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // Should have 2 items: file2.txt and file3.txt
  expect(itemCount).toBe(2)
}
