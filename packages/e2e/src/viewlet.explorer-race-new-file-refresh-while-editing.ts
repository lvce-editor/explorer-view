import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-file-refresh-while-editing'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()
  await Explorer.updateEditingValue('draft.txt')

  // act: newFile should be a no-op (editingIndex !== -1), refresh rebuilds — both fire concurrently
  await Promise.all([Explorer.newFile(), Explorer.refresh()])

  // assert: explorer should be stable — no crash, no duplicate inputs
  // file1.txt should always be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  await expect(file1).toBeVisible()

  // At most 2 tree items (file1.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  const thirdItem = treeItems.nth(2)
  await expect(thirdItem).toBeHidden()

  // At most 1 input box
  const inputBox = Locator('input')
  const secondInput = inputBox.nth(1)
  await expect(secondInput).toBeHidden()
}
