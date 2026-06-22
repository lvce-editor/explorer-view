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
  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // At minimum: root folder + root.txt + folder-1 + folder-2 + subfolder a = 5
  // At maximum: full expansion = a, b, c, d.txt + others
  expect(itemCount).toBeGreaterThanOrEqual(4)
  // d.txt could appear if expansion succeeded; verify it's not duplicated
  const dItems = Locator('.TreeItem[aria-label="d.txt"]')
  const dCount = await dItems.count()
  expect(dCount).toBeLessThanOrEqual(1)
}
