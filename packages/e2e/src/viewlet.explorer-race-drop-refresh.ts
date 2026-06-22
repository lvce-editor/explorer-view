import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-drop-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/f1.txt`, 'f1')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.expandRecursively')
  // drag f1.txt over folder b
  await Command.execute('Explorer.focusIndex', 1)
  await Command.execute('Explorer.handleDragOverIndex', 2)

  // act: handleDrop drops the dragged file, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleDrop'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no duplicate items
  // folder a and folder b should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()

  // At most 4 tree items (a + possibly f1.txt + b + possibly pasted f1.txt)
  const treeItems = Locator('.TreeItem')
  const row4 = treeItems.nth(4)
  await expect(row4).toBeHidden()
}
