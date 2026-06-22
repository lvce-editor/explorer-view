import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-double-click-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act: double-click on empty space creates a new file input, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleDoubleClick', 20, 100), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no duplicate items
  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // At minimum we should have 1 tree item (the file). If the input survived refresh, up to 2.
  expect(itemCount).toBeGreaterThanOrEqual(1)
  expect(itemCount).toBeLessThanOrEqual(2)
}
