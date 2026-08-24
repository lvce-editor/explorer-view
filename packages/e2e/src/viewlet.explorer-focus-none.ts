import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-none'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.setFiles([
    { content: 'content 1', uri: `${tmpDir}/file1.txt` },
    { content: 'content 2', uri: `${tmpDir}/file2.txt` },
    { content: 'content 3', uri: `${tmpDir}/file3.txt` },
  ])
  await Workspace.setPath(tmpDir)

  // focus a file
  await Explorer.focusIndex(1)
  const file2 = Locator('.TreeItem').nth(1)
  await expect(file2).toHaveId('TreeItemActive')

  // act
  await Explorer.focusNone()

  // assert - no item should have the active id
  const activeItem = Locator('#TreeItemActive')
  await expect(activeItem).toBeHidden()
}
