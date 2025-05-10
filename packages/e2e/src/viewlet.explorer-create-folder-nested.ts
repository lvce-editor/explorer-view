import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-folder-nested'

export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Explorer, Locator, expect }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')

  await Workspace.setPath(tmpDir)

  // act
  await Explorer.newFolder()

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toBeVisible()
  await expect(inputBox).toBeFocused()

  // act
  await inputBox.type('a/b/c')
  await Explorer.updateEditingValue('a/b/c')
  await Explorer.acceptEdit()

  // assert
  const newFile = Locator('text=c')
  await expect(newFile).toBeVisible()
}
