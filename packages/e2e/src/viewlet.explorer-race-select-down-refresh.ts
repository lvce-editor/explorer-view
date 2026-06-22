import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-select-down-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: selectDown extends selection downward, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.selectDown'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no stale selection
  // All files should be visible
  const file1 = Locator('.TreeItem[aria-label="file1.txt"]')
  const file2 = Locator('.TreeItem[aria-label="file2.txt"]')
  const file3 = Locator('.TreeItem[aria-label="file3.txt"]')
  await expect(file1).toBeVisible()
  await expect(file2).toBeVisible()
  await expect(file3).toBeVisible()

  // Exactly 3 tree items
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(3)
}
