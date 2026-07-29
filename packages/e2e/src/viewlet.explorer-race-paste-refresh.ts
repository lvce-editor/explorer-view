import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-paste-refresh'

export const skip = 1

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/f1.txt`, 'f1')
  await FileSystem.writeFile(`${tmpDir}/a/f2.txt`, 'f2')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)
  await Explorer.handleCopy()
  await Explorer.focusIndex(3)

  // act: handlePaste pastes the copied file into folder b, refresh rebuilds the tree — both fire concurrently
  await Promise.all([Explorer.handlePaste(), Explorer.refresh()])

  // assert: explorer should be stable — no crash, no duplicate items
  // folder a and folder b should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()

  // At most 6 tree items (a + 2 children + b + possibly f1.txt copy)
  const treeItems = Locator('.TreeItem')
  const row6 = treeItems.nth(6)
  await expect(row6).toBeHidden()
}
