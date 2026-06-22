import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-recursively-collapse-all'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b/c`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c/d.txt`, 'd')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: expandRecursively unfolds the tree, collapseAll collapses it — both fire concurrently
  await Promise.all([Command.execute('Explorer.expandRecursively'), Command.execute('Explorer.collapseAll')])

  // assert: explorer should be stable — no crash, no orphaned children without parent
  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // If collapseAll won: 2 items (a + root.txt). If expandRecursively won: more items
  // But we should never have a partial state where children exist without parent
  expect(itemCount).toBeGreaterThanOrEqual(2)

  // Verify no orphaned children — if d.txt is visible, its parents (a, b, c) must also be visible
  const dItems = Locator('.TreeItem[aria-label="d.txt"]')
  const dCount = await dItems.count()
  if (dCount === 1) {
    const a = Locator('.TreeItem[aria-label="a"]')
    const b = Locator('.TreeItem[aria-label="b"]')
    const c = Locator('.TreeItem[aria-label="c"]')
    await expect(a).toBeVisible()
    await expect(b).toBeVisible()
    await expect(c).toBeVisible()
  }
}
