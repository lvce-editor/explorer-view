import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-recursively-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a/b/c`)
  await FileSystem.writeFile(`${tmpDir}/a/b/c/d.txt`, 'd')
  await FileSystem.mkdir(`${tmpDir}/folder-1`)
  await FileSystem.mkdir(`${tmpDir}/folder-2`)
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.focusIndex', 0)

  // act: expandRecursively reads children recursively, refresh rebuilds tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.expandRecursively'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no duplicate items
  // root folder items should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const rootFile = Locator('.TreeItem[aria-label="root.txt"]')
  const f1 = Locator('.TreeItem[aria-label="folder-1"]')
  const f2 = Locator('.TreeItem[aria-label="folder-2"]')
  await expect(a).toBeVisible()
  await expect(rootFile).toBeVisible()
  await expect(f1).toBeVisible()
  await expect(f2).toBeVisible()

  // d.txt should not appear more than once
  const dItems = Locator('.TreeItem[aria-label="d.txt"]')
  const secondD = dItems.nth(1)
  await expect(secondD).toBeHidden()
}
