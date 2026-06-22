import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-accept-edit-cancel'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Command.execute('Explorer.newFile')
  await Command.execute('Explorer.updateEditingValue', 'created.txt')

  // act: acceptEdit creates the file, cancelEdit (escape) cancels — both fire concurrently
  await Promise.all([Command.execute('Explorer.acceptEdit'), Command.execute('Explorer.cancelEdit')])

  // assert: explorer should be stable — no crash
  // The file either exists (accept won) or does not (cancel won)
  const treeItems = Locator('.TreeItem')
  const itemCount = await treeItems.count()
  // If accept won: 2 items (file1.txt + created.txt). If cancel won: 1 item (file1.txt)
  expect(itemCount).toBeGreaterThanOrEqual(1)
  expect(itemCount).toBeLessThanOrEqual(2)
}
