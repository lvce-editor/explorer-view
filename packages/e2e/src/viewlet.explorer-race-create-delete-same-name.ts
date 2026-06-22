import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-create-delete-same-name'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'file2.txt')
  await Command.execute('Explorer.focusIndex', 1)

  // act: acceptEdit tries to create 'file2.txt' (which already exists), removeDirent deletes file2.txt — both fire concurrently
  await Promise.all([Command.execute('Explorer.acceptEdit'), Command.execute('Explorer.removeDirent')])

  // assert: explorer should be stable — no crash
  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // At most 2 tree items (file1.txt + possibly file2.txt or editing row)
  const treeItems = Locator('.TreeItem')
  const row2 = treeItems.nth(2)
  await expect(row2).toBeHidden()
}
