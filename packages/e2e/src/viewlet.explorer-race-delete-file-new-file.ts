import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-delete-file-new-file'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: removeDirent deletes the focused file, newFile inserts an editing item — both fire concurrently
  await Promise.all([Command.execute('Explorer.removeDirent'), Command.execute('Explorer.newFile')])

  // assert: explorer should be stable — no crash, no stale rows
  // file2.txt and file3.txt should always be visible
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  // At most 4 tree items (3 files - 1 deleted + 1 editing row = could be 2-4)
  const treeItems = Locator('.TreeItem')
  await expect(treeItems.nth(4)).toBeHidden()
}
