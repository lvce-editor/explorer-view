import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-rename-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/b.txt`, 'b')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: renameDirent starts inline rename, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.renameDirent'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no stale rows
  // a.txt and b.txt should always be visible
  const a = Locator('.TreeItem[aria-label="a.txt"]')
  const b = Locator('.TreeItem[aria-label="b.txt"]')
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()

  // At most 3 tree items (a.txt + b.txt + possibly editing row)
  const treeItems = Locator('.TreeItem')
  const row3 = treeItems.nth(3)
  await expect(row3).toBeHidden()
}
