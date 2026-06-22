import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-blur-refresh'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'created.txt')

  // act: blur auto-accepts the edit (creates file), refresh rebuilds the tree — both fire concurrently
  await Promise.all([Command.execute('Explorer.handleInputBlur'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash
  // The file should exist on disk
  const exists = await FileSystem.exists(`${tmpDir}/created.txt`)
  expect(exists).toBe(true)

  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // Should have 2 items: file1.txt and created.txt
  expect(itemCount).toBe(2)
}
