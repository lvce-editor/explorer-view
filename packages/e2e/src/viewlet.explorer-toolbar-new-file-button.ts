import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-toolbar-new-file-button'

export const test: Test = async ({ expect, Explorer, FileSystem, Locator, Workspace }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFile()
  await Explorer.updateEditingValue('created.txt')
  await Explorer.acceptEdit()

  // assert
  const newFile = Locator('.Explorer').locator('text=created.txt')
  await expect(newFile).toBeVisible()
}
