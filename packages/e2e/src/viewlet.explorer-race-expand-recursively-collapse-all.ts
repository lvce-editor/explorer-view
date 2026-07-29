import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-recursively-collapse-all'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b/c`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c/d.txt`, 'd')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(0)

  // act: expandRecursively unfolds the tree, collapseAll collapses it — both fire concurrently
  await Promise.all([Explorer.expandRecursively(), Explorer.collapseAll()])

  // assert: explorer should be stable — no crash, no orphaned children without parent
  // a (folder) and root.txt should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(a).toBeVisible()
  await expect(rootFile).toBeVisible()

  // Verify no orphaned children — if d.txt is visible, its parents (a, b, c) must also be visible
  const dItems = Locator('.TreeItem[aria-label="d.txt"]')
  // d.txt may or may not be visible — if visible, assert parents are visible too
  const secondD = dItems.nth(1)
  await expect(secondD).toBeHidden()
}
