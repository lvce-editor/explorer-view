import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-race-new-folder-twice'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // act: two newFolder commands concurrently try to insert an editing row
  await Promise.all([Explorer.newFolder(), Explorer.newFolder()])

  // assert: the editing guard permits only one row and one input
  const treeItems = Locator('.TreeItem')
  const inputs = Locator('.Explorer input')
  await expect(treeItems).toHaveCount(3)
  await expect(inputs).toHaveCount(1)
}
