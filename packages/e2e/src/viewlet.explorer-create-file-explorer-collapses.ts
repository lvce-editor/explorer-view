import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-explorer-collapses'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()
  const inputBox = Locator('input')
  await Explorer.updateEditingValue('test-file.txt')

  // act
  await Explorer.collapseAll()

  // assert
  await expect(inputBox).toBeHidden()

  // TODO focus should be at on tree
}
