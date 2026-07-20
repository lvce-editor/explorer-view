import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-paste-delete'

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
  // focus folder b (index 3 after expand: a[0], f1[1], f2[2], b[3])
  await Explorer.focusIndex(3)

  // act: handlePaste pastes into folder b, removeDirent deletes folder b — both fire concurrently
  await Promise.all([Explorer.handlePaste(), Explorer.removeDirent()])

  // assert: explorer should be stable — no crash, no orphaned pasted items
  // folder a should always be visible
  const a = Locator('.TreeItem[aria-label="a"]')
  await expect(a).toBeVisible()

  // f1.txt and f2.txt should be visible (in folder a)
  const f1 = Locator('.TreeItem[aria-label="f1.txt"]')
  const f2 = Locator('.TreeItem[aria-label="f2.txt"]')
  await expect(f1).toBeVisible()
  await expect(f2).toBeVisible()

  // At most 5 tree items (a + 2 children + possibly b or copied file)
  const treeItems = Locator('.TreeItem')
  const row5 = treeItems.nth(5)
  await expect(row5).toBeHidden()
}
