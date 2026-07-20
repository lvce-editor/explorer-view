import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-folder-cancel-edit'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)

  // act: newFolder inserts an editing row while cancelEdit concurrently tries to remove it
  await Promise.all([Command.execute('Explorer.newFolder'), Command.execute('Explorer.cancelEdit')])

  // assert: existing rows remain stable and at most one editing row survives
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const inputs = Locator('.Explorer input')
  const duplicateInput = inputs.nth(1)
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()
  await expect(duplicateInput).toBeHidden()

  const treeItems = Locator('.TreeItem')
  const extraTreeItem = treeItems.nth(3)
  await expect(extraTreeItem).toBeHidden()
}
