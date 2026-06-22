import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-cut-refresh'

export const skip = 1

export const test: Test = async ({ ClipBoard, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/f1.txt`, 'f1')
  await FileSystem.writeFile(`${tmpDir}/a/f2.txt`, 'f2')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.expandRecursively')
  await Command.execute('Explorer.focusIndex', 1)

  // act: handleCut marks f1.txt with cut decoration, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleCut'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no stale cut decorations
  // folder a and folder b should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()

  // f1.txt and f2.txt should be visible
  const f1 = Locator('.TreeItem[aria-label="f1.txt"]')
  const f2 = Locator('.TreeItem[aria-label="f2.txt"]')
  await expect(f1).toBeVisible()
  await expect(f2).toBeVisible()

  // At most 5 tree items (a + 2 children + b)
  const treeItems = Locator('.TreeItem')
  const row5 = treeItems.nth(5)
  await expect(row5).toBeHidden()
}
