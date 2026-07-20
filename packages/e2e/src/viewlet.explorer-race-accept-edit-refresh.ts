import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-accept-edit-refresh'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'created.txt')

  // act: acceptEdit creates the file on disk, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.acceptEdit'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no duplicate items
  // The file should exist on disk (created by acceptEdit)
  await FileSystem.shouldHaveFile(`${tmpDir}/created.txt`, '')

  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // created.txt should be visible (either from acceptEdit or from refresh picking it up)
  const created = Locator('.TreeItem[aria-label="created.txt"]')
  await expect(created).toBeVisible()

  // At most 2 items — no extras
  const treeItems = Locator('.TreeItem')
  const thirdItem = treeItems.nth(2)
  await expect(thirdItem).toBeHidden()
}
