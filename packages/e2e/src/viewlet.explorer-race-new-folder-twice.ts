import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-folder-twice'

export const skip = 1

export const test: Test = async ({ Command, expect, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await Workspace.setPath(tmpDir)

  // act: two newFolder commands concurrently try to insert an editing row
  await Promise.all([Command.execute('Explorer.newFolder'), Command.execute('Explorer.newFolder')])

  // assert: the editing guard permits only one row and one input
  const treeItems = Locator('.TreeItem')
  const inputs = Locator('.Explorer input')
  await expect(treeItems).toHaveCount(3)
  await expect(inputs).toHaveCount(1)
}
