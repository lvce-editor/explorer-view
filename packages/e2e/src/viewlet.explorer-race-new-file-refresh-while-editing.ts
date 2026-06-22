import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-file-refresh-while-editing'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'draft.txt')

  // act: newFile should be a no-op (editingIndex !== -1), refresh rebuilds — both fire concurrently
  await Promise.all([Command.execute('Explorer.newFile'), Command.execute('Explorer.refresh')])

  // assert: explorer should be stable — no crash, no duplicate inputs
  const inputBox = Locator('input')
  const inputCount = await inputBox.count()
  // If refresh cancelled the edit, input is hidden; otherwise 1 input
  expect(inputCount).toBeLessThanOrEqual(1)

  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // At minimum 1 item (file1.txt), at most 2 (file1.txt + editing row)
  expect(itemCount).toBeGreaterThanOrEqual(1)
  expect(itemCount).toBeLessThanOrEqual(2)
}
