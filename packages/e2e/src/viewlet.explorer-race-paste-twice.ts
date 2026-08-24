import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-paste-twice'

export const test: Test = async ({ ClipBoard, expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Explorer.expandRecursively()
  await Explorer.focusIndex(1)
  await Explorer.handleCopy()
  await Explorer.focusIndex(2)

  // act: two paste commands concurrently copy the same source into the same target
  await Promise.all([Explorer.handlePaste(), Explorer.handlePaste()])

  // assert: source and target remain stable without duplicate tree rows for one URI
  const entries = await FileSystem.readDir(tmpDir)
  const names = entries.map((entry) => entry.name)
  if (!names.includes('a') || !names.includes('b')) {
    throw new Error(`Expected source and target folders on disk, got ${JSON.stringify(names)}`)
  }
  const treeItems = Locator('.TreeItem')
  await expect(treeItems).toHaveCount(5)
  await expect(treeItems.nth(0)).toHaveAttribute('title', `${tmpDir}/a`)
  const a = Locator(`.TreeItem[title="${tmpDir}/a"]`)
  const b = Locator(`.TreeItem[title="${tmpDir}/b"]`)
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()
}
