import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-delete-child'

export const skip = 1

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/f1.txt`, 'f1')
  await FileSystem.writeFile(`${tmpDir}/a/f2.txt`, 'f2')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  // focus f1.txt (index 1 after expand)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)

  // act: handleClick on folder a toggles expand/collapse, removeDirent deletes f1.txt — both fire concurrently
  await Promise.all([Explorer.handleClick(0), Explorer.removeDirent()])

  // assert: explorer should be stable — no crash, no stale rows
  // folder a and root.txt should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  await expect(a).toBeVisible()
  await expect(rootFile).toBeVisible()

  // f2.txt should be visible (only remaining child)
  const f2 = Locator('.TreeItem[aria-label="f2.txt"]')
  await expect(f2).toBeVisible()

  // At most 3 tree items (a + f2.txt + root.txt)
  const treeItems = Locator('.TreeItem')
  const row3 = treeItems.nth(3)
  await expect(row3).toBeHidden()
}
