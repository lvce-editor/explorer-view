import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-rename-twice'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'b')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: two concurrent renameDirent calls on the same focused item
  await Promise.all([Explorer.renameDirent(), Explorer.renameDirent()])

  // assert: explorer should be stable — no crash, no duplicate inputs
  // a.txt and b.txt should always be visible
  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()

  // At most 3 tree items (a.txt + b.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  const row3 = treeItems.nth(3)
  await expect(row3).toBeHidden()

  // At most 1 input box
  const inputBox = Locator('input')
  const extraInput = inputBox.nth(1)
  await expect(extraInput).toBeHidden()
}
