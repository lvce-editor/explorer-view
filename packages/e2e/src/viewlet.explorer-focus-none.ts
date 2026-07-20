import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-none'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await FileSystem.writeFile(`${tmpDir}/file2.txt`, 'content 2')
  await FileSystem.writeFile(`${tmpDir}/file3.txt`, 'content 3')
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
