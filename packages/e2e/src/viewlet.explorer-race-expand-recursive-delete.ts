import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-recursive-delete'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b/c`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c/d.txt`, 'd')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: expandRecursively unfolds the tree, removeDirent deletes folder a — both fire concurrently
  await Promise.all([Command.execute('Explorer.expandRecursively'), Command.execute('Explorer.removeDirent')])

  // assert: explorer should be stable — no crash, no orphaned children without parent
  // root.txt should always be visible
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(rootFile).toBeVisible()

  // At most 2 tree items (a may be gone + root.txt)
  const treeItems = Locator('.TreeItem')
  const row2 = treeItems.nth(2)
  await expect(row2).toBeHidden()
}
