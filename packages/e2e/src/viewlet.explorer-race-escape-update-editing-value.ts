import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-escape-update-editing-value'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'draft.txt')

  // act: handleEscape cancels the edit, updateEditingValue tries to set a value on cancelled edit — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleEscape'), Command.execute('Explorer.updateEditingValue', 'other.txt')])

  // assert: explorer should be stable — no crash, no stale editing state
  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // At most 2 tree items (file1.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  const row2 = treeItems.nth(2)
  await expect(row2).toBeHidden()

  // input should be hidden (escape cancelled the edit)
  const inputBox = Locator('input')
  await expect(inputBox).toBeHidden()
}
