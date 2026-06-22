import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-expand-folder-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/folder`)
  await FileSystem.writeFile(`${tmpDir}/folder/a.txt`, 'a')
  await FileSystem.writeFile(`${tmpDir}/folder/b.txt`, 'b')
  await FileSystem.writeFile(`${tmpDir}/folder/c.txt`, 'c')
  await FileSystem.writeFile(`${tmpDir}/root.txt`, 'root')
  await Workspace.setPath(tmpDir)

  // act: click folder to expand (async reads children), refresh rebuilds tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleClick', 0), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no duplicate children
  const folder = Locator('.TreeItem[aria-label="folder"]')
  await expect(folder).toBeVisible()

  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // After refresh + expand, should have folder (expanded or not) + root.txt + possible children
  // Minimum: folder + root.txt = 2 items (if not expanded). Maximum: folder + 3 children + root.txt = 5
  expect(itemCount).toBeGreaterThanOrEqual(2)
  expect(itemCount).toBeLessThanOrEqual(5)
}
