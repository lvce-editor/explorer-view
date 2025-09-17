import type { Test } from '@lvce-editor/test-with-playwright'

export const name = 'viewlet.explorer-create-file-error-already-exists'

export const skip = 1

export const test: Test = async ({ FileSystem, Workspace, Explorer, expect, Locator }) => {
  // arrange
  const tmpDir = await FileSystem.getTmpDir()
  await FileSystem.writeFile(`${tmpDir}/file1.txt`, 'content 1')
  await Workspace.setPath(tmpDir)
  await Explorer.newFile()

  // act
  await Explorer.updateEditingValue('file1.txt')

  // assert
  const inputBox = Locator('input')
  await expect(inputBox).toHaveClass('InputValidationError')
  const errorMessage = Locator('.ExplorerErrorMessage')
  await expect(errorMessage).toBeVisible()
  await expect(errorMessage).toHaveText('file already exists, choose a different name')
}
