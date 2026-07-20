import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-escape-new-file'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()

  // act: cancelEdit cancels the editing row, newFile tries to start a new one — both fire concurrently
  await Promise.all([Explorer.cancelEdit(), Explorer.newFile()])

  // assert: explorer should be stable — no crash, no duplicate inputs
  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // At most 2 tree items (file1.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  const row2 = treeItems.nth(2)
  await expect(row2).toBeHidden()

  // At most 1 input box
  const inputBox = Locator('input')
  const extraInput = inputBox.nth(1)
  await expect(extraInput).toBeHidden()
}
