import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-recursive-click-child'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b/c`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c/d.txt`, 'd')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: expandRecursively unfolds the entire tree, handleClick on folder a toggles expand — both fire concurrently
  await Promise.all([Explorer.expandRecursively(), Explorer.handleClick(0)])

  // assert: explorer should be stable — no crash, no orphaned children
  // a and root.txt should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(a).toBeVisible()
  await expect(rootFile).toBeVisible()

  // At most 5 tree items (a + b + c + d.txt + root.txt)
  const treeItems = Locator('.TreeItem')
  const row5 = treeItems.nth(5)
  await expect(row5).toBeHidden()
}
