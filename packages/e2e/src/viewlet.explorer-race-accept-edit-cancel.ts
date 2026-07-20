import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-accept-edit-cancel'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'created.txt')

  // act: acceptEdit creates the file, cancelEdit (escape) cancels — both fire concurrently
  await Promise.all([Command.execute('Explorer.acceptEdit'), Command.execute('Explorer.cancelEdit')])

  // assert: explorer should be stable — no crash
  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // At most 2 tree items (file1.txt + possibly created.txt or editing row)
  const treeItems = Locator('.TreeItem')
  const thirdItem = treeItems.nth(2)
  await expect(thirdItem).toBeHidden()

  // input should be hidden (edit was either accepted or cancelled)
  const inputBox = Locator('input')
  await expect(inputBox).toBeHidden()
}
