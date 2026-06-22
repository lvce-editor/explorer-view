import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-focus-after-create-file'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFile()
  await Explorer.updateEditingValue('new-file.txt')
  await Explorer.acceptEdit()

  // assert - the new file should be visible and focused
  const newFile = Locator('.TreeItem[aria-label="new-file.txt"]')
  await expect(newFile).toBeVisible()
  await expect(newFile).toHaveId('TreeItemActive')
}
