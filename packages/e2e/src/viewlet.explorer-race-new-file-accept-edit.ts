import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-file-accept-edit'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'created.txt')

  // act: newFile is no-op (already editing), acceptEdit creates the file — both fire concurrently
  await Promise.all([Command.execute('Explorer.newFile'), Command.execute('Explorer.acceptEdit')])

  // assert: explorer should be stable — no crash, no duplicate items
  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // created.txt should be visible (acceptEdit succeeded)
  const created = Locator('.TreeItem[aria-label="created.txt"]')
  await expect(created).toBeVisible()

  // Exactly 2 tree items — no extras
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(2)
}
