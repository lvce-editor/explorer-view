import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-rename-delete'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'b')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: renameDirent starts inline rename on a.txt, removeDirent deletes a.txt — both fire concurrently
  await Promise.all([Command.execute('Explorer.renameDirent'), Command.execute('Explorer.removeDirent')])

  // assert: explorer should be stable — no crash, no stale references to deleted item
  // b.txt should always be visible
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(b).toBeVisible()

  // At most 2 tree items (b.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  const row2 = treeItems.nth(2)
  await expect(row2).toBeHidden()
}
