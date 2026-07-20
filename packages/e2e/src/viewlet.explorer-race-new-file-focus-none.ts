import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-file-focus-none'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)

  // act: newFile creates editing row, focusNone clears all focus — both fire concurrently
  await Promise.all([Command.execute('Explorer.newFile'), Command.execute('Explorer.focusNone')])

  // assert: explorer should be stable — no crash, no stale focus
  // file1.txt and file2.txt should be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()

  // At most 3 tree items (file1.txt + file2.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  const row3 = treeItems.nth(3)
  await expect(row3).toBeHidden()

  // At most 1 input box
  const inputBox = Locator('input')
  const extraInput = inputBox.nth(1)
  await expect(extraInput).toBeHidden()
}
