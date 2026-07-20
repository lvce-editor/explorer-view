import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-collapse-all-expand-one'

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.mkdir(`${tmpDir}/b`)
  await FileSystem.writeFile(`${tmpDir}/a/f1.txt`, 'f1')
  await FileSystem.writeFile(`${tmpDir}/b/f2.txt`, 'f2')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.expandRecursively')

  // act: collapseAll collapses the tree, handleClick on folder a expands it — both fire concurrently
  await Promise.all([Command.execute('Explorer.collapseAll'), Command.execute('Explorer.handleClick', 0)])

  // assert: explorer should be stable — no crash, no orphaned children
  // folder a and folder b should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()

  // At most 4 tree items (a + b + possibly children)
  const treeItems = Locator('.TreeItem')
  const row4 = treeItems.nth(4)
  await expect(row4).toBeHidden()
}
