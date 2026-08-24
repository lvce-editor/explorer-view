import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-select-multiple-files-with-mouse'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)
  await Explorer.focusIndex(2)

  // act
  await Explorer.handleClickAt(false, 0, false, true, 300, 0)

  // assert
  const file1 = Locator('.TreeItem').nth(0)
  await expect(file1).toHaveClass('TreeItemActive')
  const file2 = Locator('.TreeItem').nth(1)
  await expect(file2).toHaveClass('TreeItemActive')
  const file3 = Locator('.TreeItem').nth(2)
  await expect(file3).toHaveClass('TreeItemActive')
}
