import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-paste-twice'

export const skip = 1

export const test: Test = async ({ ClipBoard, Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  await ClipBoard.enableMemoryClipBoard()
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.mkdir(`${tmpDir}/a`)
  await FileSystem.writeFile(`${tmpDir}/a/file.txt`, 'content')
  await FileSystem.mkdir(`${tmpDir}/b`)
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.expandRecursively')
  await Command.execute('Explorer.focusIndex', 1)
  await Command.execute('Explorer.handleCopy')
  await Command.execute('Explorer.focusIndex', 2)

  // act: two paste commands concurrently copy the same source into the same target
  await Promise.all([Command.execute('Explorer.handlePaste'), Command.execute('Explorer.handlePaste')])

  // assert: source and target remain stable without duplicate tree rows for one URI
  const a = Locator('.TreeItem[aria-label="a"]')
  const b = Locator('.TreeItem[aria-label="b"]')
  const sourceFiles = Locator('.TreeItem[aria-label="file.txt"]')
  const duplicateSource = sourceFiles.nth(2)
  await expect(a).toBeVisible()
  await expect(b).toBeVisible()
  await expect(duplicateSource).toBeHidden()

  const treeItems = Locator('.TreeItem')
  const extraTreeItem = treeItems.nth(5)
  await expect(extraTreeItem).toBeHidden()
}
